"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured, serverEnv } from "@/lib/env";
import { notifyNewInquiry } from "@/lib/notify";
import { createServiceClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/types";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string>; values?: Record<string, string> } | null;

/** Echo text fields back so the form can be re-filled after a validation error. */
const echo = (fd: FormData) =>
  Object.fromEntries([...fd.entries()].filter(([k, v]) => typeof v === "string" && !["t", "website", "items", "consent"].includes(k) && !k.startsWith("$")) as [string, string][]);

const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);

const base = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli").max(120),
  company: text(160),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin").max(200),
  phone: text(40),
  city: text(80),
  message: text(5000),
  consent: z.literal("on", { message: "Devam etmek için aydınlatma metnini onaylayın" }),
});

const quoteItem = z.object({
  product_id: z.string().max(80).nullish(),
  slug: z.string().max(120).nullish(),
  code: z.string().trim().min(1).max(60),
  name: z.string().trim().max(200),
  quantity: z.coerce.number().int().min(1).max(100000),
  note: z.string().trim().max(500).optional(),
});

const contactSchema = base.extend({ subject: text(200) });
const quoteSchema = base.extend({
  items: z.string().transform((s, ctx) => {
    try {
      return z.array(quoteItem).max(50).parse(JSON.parse(s || "[]"));
    } catch {
      ctx.addIssue({ code: "custom", message: "Ürün listesi okunamadı" });
      return z.NEVER;
    }
  }),
  medium: text(200), temperature: text(80), pressure: text(80), speed: text(80), shaft: text(80), equipment: text(200),
});

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Cloudflare Turnstile check; skipped when no secret key is configured. */
async function turnstileFailed(fd: FormData, ip: string | null) {
  const { turnstileSecret } = serverEnv();
  if (!turnstileSecret) return false;
  const token = String(fd.get("cf-turnstile-response") ?? "");
  if (!token) return true;
  try {
    const body = new URLSearchParams({ secret: turnstileSecret, response: token, ...(ip ? { remoteip: ip } : {}) });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return !data.success;
  } catch (err) {
    console.error("[turnstile]", err);
    return true;
  }
}

const TURNSTILE_ERROR = "Güvenlik doğrulaması tamamlanamadı. Lütfen doğrulamayı yenileyip tekrar gönderin.";

/** Simple bot filters: hidden honeypot field + minimum fill time. */
function looksLikeBot(fd: FormData) {
  if (String(fd.get("website") ?? "").length > 0) return true;
  const started = Number(fd.get("t") ?? 0);
  return !started || Date.now() - started < 2500;
}

async function store(row: Omit<Inquiry, "id" | "status" | "admin_notes" | "created_at" | "updated_at">): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    console.warn("[inquiry] Supabase is not configured; inquiry not stored", row);
    return { ok: false, message: "Form şu anda çalışmıyor (veritabanı yapılandırılmadı). Lütfen telefon veya e-posta ile ulaşın." };
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("inquiries").insert(row).select("*").single();
  if (error) {
    console.error("[inquiry]", error);
    return { ok: false, message: "Talebiniz kaydedilemedi. Lütfen daha sonra tekrar deneyin veya bizi arayın." };
  }
  // Push + e-mail after the response is sent (Workers: waitUntil).
  after(() => notifyNewInquiry(data as Inquiry));
  return { ok: true, message: "" };
}

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  if (looksLikeBot(fd)) return { ok: true, message: "Mesajınız alındı." };
  const hdrs = await headers();
  if (await turnstileFailed(fd, hdrs.get("cf-connecting-ip"))) return { ok: false, message: TURNSTILE_ERROR, values: echo(fd) };
  const parsed = contactSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: "Lütfen işaretli alanları kontrol edin.", errors: fieldErrors(parsed.error), values: echo(fd) };
  const h = hdrs;
  const d = parsed.data;
  const res = await store({
    kind: "contact", name: d.name, company: d.company, email: d.email, phone: d.phone, city: d.city,
    subject: d.subject, message: d.message, items: [], details: {},
    source_url: h.get("referer"), user_agent: h.get("user-agent"),
  });
  return res?.ok ? { ok: true, message: "Mesajınız alındı. En kısa sürede size dönüş yapacağız." } : { ...res!, values: echo(fd) };
}

export async function submitQuote(_: FormState, fd: FormData): Promise<FormState> {
  if (looksLikeBot(fd)) return { ok: true, message: "Teklif talebiniz alındı." };
  const hdrs = await headers();
  if (await turnstileFailed(fd, hdrs.get("cf-connecting-ip"))) return { ok: false, message: TURNSTILE_ERROR, values: echo(fd) };
  const parsed = quoteSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: "Lütfen işaretli alanları kontrol edin.", errors: fieldErrors(parsed.error), values: echo(fd) };
  const d = parsed.data;
  if (!d.items.length && !d.message) {
    return { ok: false, message: "Teklif listesine ürün ekleyin veya ihtiyacınızı mesaj alanında açıklayın.", errors: { message: "Ürün ya da açıklama gerekli" }, values: echo(fd) };
  }
  const h = hdrs;
  const details = Object.fromEntries(
    Object.entries({ medium: d.medium, temperature: d.temperature, pressure: d.pressure, speed: d.speed, shaft: d.shaft, equipment: d.equipment }).filter(([, v]) => v),
  ) as Record<string, string>;
  const res = await store({
    kind: "quote", name: d.name, company: d.company, email: d.email, phone: d.phone, city: d.city,
    subject: d.items.length ? `${d.items.length} kalem ürün için teklif` : "Teklif talebi", message: d.message,
    items: d.items.map((i) => ({ product_id: i.product_id ?? null, slug: i.slug ?? null, code: i.code, name: i.name, quantity: i.quantity, note: i.note })), details,
    source_url: h.get("referer"), user_agent: h.get("user-agent"),
  });
  return res?.ok ? { ok: true, message: "Teklif talebiniz alındı. Teknik ekibimiz en kısa sürede sizinle iletişime geçecek." } : { ...res!, values: echo(fd) };
}
