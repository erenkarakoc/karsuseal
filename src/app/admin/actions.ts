"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { SITE_URL, SUPABASE_URL } from "@/lib/env";
import { sendEmail, sendPushToAdmins } from "@/lib/notify";
import { slugify } from "@/lib/slug";
import { createServiceClient } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; message?: string; id?: string };

// ---------------------------------------------------------------------------
// Storage cleanup: files in the public `catalog` bucket that are no longer referenced
// ---------------------------------------------------------------------------
const BUCKET_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/catalog/`;
type Db = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function removeStorageFiles(supabase: Db, urls: (string | null | undefined)[]) {
  const paths = [...new Set(urls)]
    .filter((u): u is string => Boolean(u && u.startsWith(BUCKET_PREFIX)))
    .map((u) => decodeURIComponent(u.slice(BUCKET_PREFIX.length).split("?")[0]));
  if (!paths.length) return;
  const { error } = await supabase.storage.from("catalog").remove(paths);
  if (error) console.error("[storage cleanup]", error.message);
}
const productFiles = (p: { image_url?: string | null; gallery?: string[] | null; datasheet_url?: string | null } | null) =>
  p ? [p.image_url, ...(p.gallery ?? []), p.datasheet_url] : [];

const lines = (s: unknown) => String(s ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------
export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/giris");
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------
const STATUSES = ["new", "in_progress", "answered", "closed", "spam"] as const;

export async function updateInquiry(id: string, _: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const status = z.enum(STATUSES).parse(fd.get("status"));
  const admin_notes = String(fd.get("admin_notes") ?? "").slice(0, 5000) || null;
  const { error } = await supabase.from("inquiries").update({ status, admin_notes }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Kaydedildi" };
}

export async function setInquiryStatus(id: string, status: (typeof STATUSES)[number]) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").update({ status: z.enum(STATUSES).parse(status) }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").delete().eq("id", id);
  revalidatePath("/admin", "layout");
  redirect("/admin/talepler");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const productSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  category_id: z.string().uuid({ message: "Kategori seçin" }),
  code: z.string().trim().min(1, "Ürün kodu gerekli").max(60),
  name: z.string().trim().min(2, "Ürün adı gerekli").max(200),
  slug: z.string().trim().max(120).optional(),
  summary: z.string().trim().max(400).nullable().optional(),
  description: z.string().trim().max(10000).nullable().optional(),
  specs: z.array(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) })).max(40),
  materials: z.array(z.object({ part: z.string().trim().min(1), options: z.array(z.string().trim().min(1)) })).max(20),
  features: z.array(z.string()).max(40),
  applications: z.array(z.string()).max(40),
  standards: z.array(z.string()).max(20),
  equivalents: z.array(z.string()).max(20),
  industries: z.array(z.string()).max(20),
  illustration: z.string().max(60).nullable().optional(),
  image_url: z.string().url().nullable().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).max(12),
  datasheet_url: z.string().url().nullable().optional().or(z.literal("")),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.coerce.number().int().min(0).max(100000),
});
export type ProductInput = z.input<typeof productSchema>;

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri" };
  const { id, ...p } = parsed.data;
  const row = {
    ...p,
    slug: slugify(p.slug || p.code),
    summary: p.summary || null,
    description: p.description || null,
    image_url: p.image_url || null,
    datasheet_url: p.datasheet_url || null,
    illustration: p.illustration || null,
  };
  const { data: before } = id ? await supabase.from("products").select("image_url, gallery, datasheet_url").eq("id", id).maybeSingle() : { data: null };
  const query = id ? supabase.from("products").update(row).eq("id", id).select("id").single() : supabase.from("products").insert(row).select("id").single();
  const { data, error } = await query;
  if (!error && before) {
    const kept = new Set(productFiles(row));
    await removeStorageFiles(supabase, productFiles(before).filter((u) => !kept.has(u)));
  }
  if (error) return { ok: false, message: error.code === "23505" ? "Bu URL (slug) başka bir üründe kullanılıyor." : error.message };
  revalidatePath("/", "layout");
  return { ok: true, id: data.id, message: "Ürün kaydedildi" };
}

export async function toggleProduct(id: string, field: "is_published" | "is_featured", value: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").update({ [field]: value }).eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { data: before } = await supabase.from("products").select("image_url, gallery, datasheet_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (!error) await removeStorageFiles(supabase, productFiles(before));
  revalidatePath("/", "layout");
  redirect("/admin/urunler");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function saveCategory(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const schema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(2, "Kategori adı gerekli").max(120),
    slug: z.string().trim().max(120).optional(),
    parent_id: z.string().optional(),
    summary: z.string().trim().max(400).optional(),
    description: z.string().trim().max(5000).optional(),
    illustration: z.string().max(60).optional(),
    image_url: z.string().optional(),
    sort_order: z.coerce.number().int().min(0).max(100000),
  });
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };
  const { id, ...c } = parsed.data;
  if (id && c.parent_id === id) return { ok: false, message: "Kategori kendi alt kategorisi olamaz." };
  const row = {
    name: c.name,
    slug: slugify(c.slug || c.name),
    parent_id: c.parent_id || null,
    summary: c.summary || null,
    description: c.description || null,
    illustration: c.illustration || null,
    image_url: c.image_url || null,
    sort_order: c.sort_order,
    is_published: fd.get("is_published") === "on",
  };
  const { data: before } = id ? await supabase.from("categories").select("image_url").eq("id", id).maybeSingle() : { data: null };
  const { data, error } = id
    ? await supabase.from("categories").update(row).eq("id", id).select("id").single()
    : await supabase.from("categories").insert(row).select("id").single();
  if (error) return { ok: false, message: error.code === "23505" ? "Bu URL (slug) başka bir kategoride kullanılıyor." : error.message };
  if (before?.image_url && before.image_url !== row.image_url) await removeStorageFiles(supabase, [before.image_url]);
  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/kategoriler/${data.id}`);
  return { ok: true, id: data.id, message: "Kategori kaydedildi" };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count) return { ok: false, message: `Bu kategoride ${count} ürün var. Önce ürünleri başka kategoriye taşıyın.` };
  const { data: before } = await supabase.from("categories").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (!error) await removeStorageFiles(supabase, [before?.image_url]);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  redirect("/admin/kategoriler");
}

// ---------------------------------------------------------------------------
// Settings & notifications
// ---------------------------------------------------------------------------
export async function saveSettings(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const emails = lines(fd.get("notification_emails")).map((e) => e.toLowerCase());
  const bad = emails.find((e) => !z.string().email().safeParse(e).success);
  if (bad) return { ok: false, message: `Geçersiz e-posta: ${bad}` };
  const str = (k: string) => String(fd.get(k) ?? "").trim() || null;
  const { error } = await supabase
    .from("settings")
    .update({
      notification_emails: emails,
      email_notifications: fd.get("email_notifications") === "on",
      push_notifications: fd.get("push_notifications") === "on",
      company_phone: str("company_phone"),
      company_whatsapp: str("company_whatsapp"),
      company_email: str("company_email"),
      company_address: str("company_address"),
      company_maps_url: str("company_maps_url"),
      working_hours: str("working_hours"),
    })
    .eq("id", 1);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Ayarlar kaydedildi" };
}

const subscriptionSchema = z.object({ endpoint: z.string().url(), keys: z.object({ p256dh: z.string().min(10), auth: z.string().min(4) }) });

export async function savePushSubscription(sub: unknown, userAgent: string): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  const parsed = subscriptionSchema.safeParse(sub);
  if (!parsed.success) return { ok: false, message: "Geçersiz abonelik" };
  const { error } = await supabase.from("push_subscriptions").upsert(
    { endpoint: parsed.data.endpoint, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth, user_email: user.email, user_agent: userAgent.slice(0, 300) },
    { onConflict: "endpoint" },
  );
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function removePushSubscription(endpoint: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  revalidatePath("/admin/ayarlar");
}

export async function sendTestPush(): Promise<ActionResult> {
  await requireAdmin();
  const res = await sendPushToAdmins({ title: "Karsu Seal test bildirimi", body: "Tarayıcı bildirimleri çalışıyor.", url: `${SITE_URL}/admin` });
  if ("skipped" in res) return { ok: false, message: "VAPID anahtarları tanımlı değil (README → Bildirimler)." };
  return { ok: res.sent > 0, message: res.sent > 0 ? `${res.sent} cihaza gönderildi` : "Kayıtlı cihaz bulunamadı. Önce bu cihazda bildirimleri açın." };
}

export async function sendTestEmail(): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("notification_emails").eq("id", 1).single();
  const to = data?.notification_emails ?? [];
  if (!to.length) return { ok: false, message: "Önce bildirim e-posta adresi ekleyip kaydedin." };
  try {
    const res = await sendEmail(to, "Karsu Seal test e-postası", `<p style="font:14px Arial">E-posta bildirimleri çalışıyor. Yeni talepler bu adreslere iletilecek.</p>`);
    if ("skipped" in res) return { ok: false, message: "RESEND_API_KEY tanımlı değil (README → Bildirimler)." };
    return { ok: true, message: `${to.join(", ")} adresine gönderildi` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gönderilemedi" };
  }
}

// ---------------------------------------------------------------------------
// Admin users
// ---------------------------------------------------------------------------
export async function inviteAdmin(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!z.string().email().safeParse(email).success) return { ok: false, message: "Geçerli bir e-posta girin" };
  const { error } = await supabase.from("admin_users").insert({ email });
  if (error && error.code !== "23505") return { ok: false, message: error.message };
  // Create the auth account and e-mail an invitation (Supabase built-in mailer).
  const service = createServiceClient();
  const { error: inviteError } = await service.auth.admin.inviteUserByEmail(email, { redirectTo: `${SITE_URL}/admin/auth/callback?next=/admin/sifre` });
  revalidatePath("/admin/ayarlar");
  if (inviteError && !/already been registered|already registered/i.test(inviteError.message)) {
    return { ok: true, message: `Yetki verildi ancak davet e-postası gönderilemedi: ${inviteError.message}` };
  }
  return { ok: true, message: inviteError ? "Yetki verildi (hesap zaten mevcut)." : "Davet e-postası gönderildi." };
}

export async function removeAdmin(email: string): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  if (email.toLowerCase() === user.email?.toLowerCase()) return { ok: false, message: "Kendi yetkinizi kaldıramazsınız." };
  await supabase.from("admin_users").delete().eq("email", email);
  revalidatePath("/admin/ayarlar");
  return { ok: true };
}

export async function updatePassword(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { ok: false, message: "Şifre en az 8 karakter olmalı" };
  if (password !== String(fd.get("password2") ?? "")) return { ok: false, message: "Şifreler eşleşmiyor" };
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { ok: false, message: error.message } : { ok: true, message: "Şifreniz güncellendi" };
}
