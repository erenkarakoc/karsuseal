import "server-only";
import { buildPushHTTPRequest } from "@pushforge/builder";
import { SITE_URL, serverEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/types";

const KIND_LABEL = { contact: "İletişim mesajı", quote: "Fiyat teklifi talebi" } as const;

type PushPayload = { title: string; body: string; url: string; tag?: string };

/** Sends browser push + e-mail for a new inquiry. Never throws: failures are logged. */
export async function notifyNewInquiry(inquiry: Inquiry) {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from("settings").select("notification_emails, email_notifications, push_notifications").eq("id", 1).single();

  const label = KIND_LABEL[inquiry.kind];
  const who = [inquiry.name, inquiry.company].filter(Boolean).join(" · ");
  const url = `${SITE_URL}/admin/talepler/${inquiry.id}`;
  const itemsLine = inquiry.items.length ? inquiry.items.map((i) => `${i.code} × ${i.quantity}`).join(", ") : "";

  const tasks: Promise<unknown>[] = [];
  if (settings?.push_notifications !== false) {
    tasks.push(sendPushToAdmins({ title: `Yeni ${label.toLocaleLowerCase("tr")}`, body: [who, itemsLine || inquiry.subject].filter(Boolean).join(" — "), url, tag: inquiry.id }));
  }
  if (settings?.email_notifications !== false && settings?.notification_emails?.length) {
    tasks.push(sendEmail(settings.notification_emails, `Yeni ${label.toLocaleLowerCase("tr")}: ${who}`, inquiryEmailHtml(inquiry, url)));
  }
  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("[notify]", r.reason);
}

export async function sendPushToAdmins(payload: PushPayload) {
  const { vapidPrivateKey, vapidSubject } = serverEnv();
  if (!vapidPrivateKey) return { sent: 0, skipped: "VAPID_PRIVATE_KEY missing" };
  const privateJWK = JSON.parse(vapidPrivateKey);
  const supabase = createServiceClient();
  const { data: subs } = await supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth");
  let sent = 0;
  await Promise.all(
    (subs ?? []).map(async (sub) => {
      try {
        const req = await buildPushHTTPRequest({
          privateJWK,
          subscription: { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          message: { payload, adminContact: vapidSubject, options: { ttl: 60 * 60 * 24, urgency: "high", topic: "inquiry" } },
        });
        const res = await fetch(req.endpoint, { method: "POST", headers: req.headers, body: req.body });
        if (res.status === 404 || res.status === 410) await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        else if (res.ok) sent++;
        else console.error("[push]", res.status, await res.text());
      } catch (err) {
        console.error("[push]", err);
      }
    }),
  );
  return { sent };
}

/** E-mail via the Resend HTTP API (free tier: 3.000 mails / month). */
export async function sendEmail(to: string[], subject: string, html: string) {
  const { resendApiKey, notifyFrom } = serverEnv();
  if (!resendApiKey) return { skipped: "RESEND_API_KEY missing" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: notifyFrom, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return { ok: true };
}

const esc = (s: string | null | undefined) =>
  (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const DETAIL_LABELS: Record<string, string> = {
  medium: "Akışkan", temperature: "Sıcaklık", pressure: "Basınç", speed: "Devir", shaft: "Mil çapı",
  equipment: "Pompa / ekipman", delivery: "Teslim yeri", urgency: "Aciliyet",
};

function inquiryEmailHtml(i: Inquiry, url: string) {
  const row = (k: string, v: string | null | undefined) =>
    v ? `<tr><td style="padding:6px 12px 6px 0;color:#5b6570;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:#0b1f3f">${esc(v)}</td></tr>` : "";
  const items = i.items.length
    ? `<h3 style="font:600 15px Arial;color:#0b1f3f;margin:20px 0 8px">Ürünler</h3><table style="border-collapse:collapse;width:100%;font:14px Arial">${i.items
        .map((it) => `<tr><td style="padding:6px 0;border-bottom:1px solid #e6ebf1"><b>${esc(it.code)}</b> ${esc(it.name)}${it.note ? `<br><span style="color:#5b6570">${esc(it.note)}</span>` : ""}</td><td style="padding:6px 0;border-bottom:1px solid #e6ebf1;text-align:right">${it.quantity} adet</td></tr>`)
        .join("")}</table>`
    : "";
  const details = Object.entries(i.details ?? {}).filter(([, v]) => v);
  return `<!doctype html><html><body style="margin:0;background:#f2f5f9;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;font:14px/1.5 Arial,sans-serif;color:#0b1f3f">
<p style="margin:0 0 4px;color:#1d5fd1;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase">Karsu Seal · ${KIND_LABEL[i.kind]}</p>
<h2 style="margin:0 0 16px;font-size:20px">${esc(i.subject || (i.kind === "quote" ? "Fiyat teklifi talebi" : "Yeni mesaj"))}</h2>
<table style="border-collapse:collapse;font:14px Arial">${row("Ad soyad", i.name)}${row("Firma", i.company)}${row("E-posta", i.email)}${row("Telefon", i.phone)}${row("Şehir", i.city)}</table>
${items}
${details.length ? `<h3 style="font:600 15px Arial;color:#0b1f3f;margin:20px 0 8px">Teknik bilgiler</h3><table style="border-collapse:collapse;font:14px Arial">${details.map(([k, v]) => row(DETAIL_LABELS[k] ?? k, v)).join("")}</table>` : ""}
${i.message ? `<h3 style="font:600 15px Arial;color:#0b1f3f;margin:20px 0 8px">Mesaj</h3><p style="white-space:pre-wrap;margin:0">${esc(i.message)}</p>` : ""}
<p style="margin:28px 0 0"><a href="${url}" style="background:#1d5fd1;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;display:inline-block">Yönetim panelinde aç</a></p>
</div></body></html>`;
}
