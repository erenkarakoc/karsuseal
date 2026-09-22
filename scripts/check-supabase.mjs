// Supabase + ortam değişkenleri kurulum kontrolü.
//   npm run check:setup            (.env.local okunur)
//   npm run check:setup -- --env .env.production
//
// Veritabanında yalnızca bir test talebi oluşturup hemen siler; başka hiçbir şeyi değiştirmez.
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(import.meta.dirname, "..");
const envArg = process.argv.indexOf("--env");
const envFile = path.join(root, envArg > -1 ? process.argv[envArg + 1] : ".env.local");

// minimal .env parser (KEY=value, optional quotes)
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

let failed = 0, warned = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const fail = (m, hint) => { failed++; console.log(`  ✗ ${m}${hint ? `\n      → ${hint}` : ""}`); };
const warn = (m, hint) => { warned++; console.log(`  ! ${m}${hint ? `\n      → ${hint}` : ""}`); };
const section = (t) => console.log(`\n${t}`);

const env = process.env;
section(`Ortam değişkenleri (${path.basename(envFile)}${fs.existsSync(envFile) ? "" : " bulunamadı — yalnızca süreç ortamı"})`);
const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY", "NEXT_PUBLIC_SITE_URL"];
for (const k of required) env[k] ? ok(k) : fail(`${k} tanımlı değil`, "README → 2. Supabase kurulumu");
env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY ? ok("VAPID anahtarları (tarayıcı bildirimleri)") : warn("VAPID anahtarları eksik — tarayıcı bildirimleri çalışmaz", "npm run vapid");
if (env.VAPID_PRIVATE_KEY) {
  try { JSON.parse(env.VAPID_PRIVATE_KEY); } catch { fail("VAPID_PRIVATE_KEY geçerli JSON değil", "npm run vapid çıktısındaki tek tırnaklı değeri olduğu gibi kopyalayın"); }
}
env.RESEND_API_KEY ? ok("RESEND_API_KEY (e-posta bildirimleri)") : warn("RESEND_API_KEY eksik — e-posta bildirimleri gönderilmez", "README → 3. Bildirimler");
env.RESEND_API_KEY && !env.NOTIFY_FROM_EMAIL && warn("NOTIFY_FROM_EMAIL eksik — Resend yalnızca kendi hesabınıza gönderir");
env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY ? ok("Turnstile spam koruması") : warn("Turnstile tanımlı değil (isteğe bağlı)");
if (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !env.TURNSTILE_SECRET_KEY) fail("NEXT_PUBLIC_TURNSTILE_SITE_KEY var ama TURNSTILE_SECRET_KEY yok — formlar doğrulama yapmadan geçer");
if (env.NEXT_PUBLIC_SITE_URL?.includes("localhost")) warn(`NEXT_PUBLIC_SITE_URL = ${env.NEXT_PUBLIC_SITE_URL} (canlıda gerçek alan adı olmalı)`);

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  console.log("\nSupabase bilgileri olmadan veritabanı kontrolleri yapılamıyor.");
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, opts);
const admin = env.SUPABASE_SECRET_KEY ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, opts) : null;

// Is the project reachable at all? (otherwise every check below would be meaningless)
const netError = (e) => e && /fetch failed|ENOTFOUND|ECONNREFUSED|network|Invalid API key/i.test(`${e.message} ${e.details ?? ""} ${e.hint ?? ""}`);
{
  const { error } = await anon.from("categories").select("id").limit(1);
  if (netError(error)) {
    fail(`Supabase'e bağlanılamadı: ${error.message}`, "NEXT_PUBLIC_SUPABASE_URL ve publishable key'i kontrol edin");
    console.log(`
✗ ${failed} hata.`);
    process.exit(1);
  }
}
// RLS denial looks like: permission error (42501) or, for SELECT, an empty result.
const denied = (e) => e && (e.code === "42501" || /permission denied|row-level security/i.test(e.message));

section("Şema ve başlangıç verisi");
{
  const { count, error } = await anon.from("categories").select("id", { count: "exact", head: true });
  if (error) fail(`categories tablosu okunamadı: ${error.message}`, "migration dosyasını SQL Editor'de çalıştırın");
  else count ? ok(`${count} kategori`) : fail("kategori yok", "supabase/seed.sql dosyasını çalıştırın");
}
{
  const { count, error } = await anon.from("products").select("id", { count: "exact", head: true });
  if (error) fail(`products tablosu okunamadı: ${error.message}`);
  else count ? ok(`${count} yayında ürün`) : fail("ürün yok", "supabase/seed.sql dosyasını çalıştırın");
}
{
  const { error } = await anon.from("products").select("search_text").limit(1);
  error ? fail("search_text sütunu yok (eski migration)", "migration dosyasının güncel halini uygulayın") : ok("arama sütunu (muadil tipler dahil)");
}
{
  const { data, error } = await anon.from("public_settings").select("*").maybeSingle();
  if (error) fail(`public_settings görünümü okunamadı: ${error.message}`);
  else {
    ok("public_settings görünümü");
    const missing = ["company_phone", "company_email", "company_address"].filter((k) => !data?.[k]);
    missing.length ? warn(`sitede görünen iletişim bilgileri eksik: ${missing.join(", ")}`, "Panel → Ayarlar") : ok("iletişim bilgileri girilmiş");
  }
}

section("Erişim kuralları (RLS) — ziyaretçi");
for (const t of ["inquiries", "settings", "push_subscriptions", "admin_users"]) {
  const { data, error } = await anon.from(t).select("*").limit(1);
  if (error) denied(error) ? ok(`${t}: erişim reddedildi`) : fail(`${t}: beklenmeyen hata: ${error.message}`);
  else data.length ? fail(`${t}: ziyaretçi veri okuyabiliyor!`, "RLS politikalarını kontrol edin") : ok(`${t}: ziyaretçiye kapalı`);
}
{
  const { error } = await anon.from("inquiries").insert({ kind: "contact", name: "rls test", email: "rls@test.invalid" });
  if (!error) fail("ziyaretçi inquiries tablosuna doğrudan yazabiliyor!");
  else denied(error) ? ok("ziyaretçi doğrudan talep ekleyemiyor") : fail(`talep ekleme testinde beklenmeyen hata: ${error.message}`);
}

if (admin) {
  section("Gizli anahtar (sunucu)");
  const { data, error } = await admin.from("inquiries").insert({ kind: "contact", name: "Kurulum testi", email: "kurulum@test.invalid", subject: "check-supabase" }).select("id").single();
  if (error) fail(`test talebi eklenemedi: ${error.message}`, "SUPABASE_SECRET_KEY doğru mu?");
  else {
    ok("form kaydı (test talebi eklendi)");
    const { error: delErr } = await admin.from("inquiries").delete().eq("id", data.id);
    delErr ? warn(`test talebi silinemedi (id ${data.id})`) : ok("test talebi silindi");
  }
  const { count } = await admin.from("admin_users").select("email", { count: "exact", head: true });
  count ? ok(`${count} yönetici`) : fail("yönetici yok", "insert into public.admin_users (email) values ('...'); — README 2.4");
  const { data: s } = await admin.from("settings").select("notification_emails").eq("id", 1).maybeSingle();
  s?.notification_emails?.length ? ok(`bildirim e-postaları: ${s.notification_emails.join(", ")}`) : warn("bildirim e-posta adresi girilmemiş", "Panel → Ayarlar → E-posta bildirimleri");

  section("Storage");
  const { data: bucket, error: bErr } = await admin.storage.getBucket("catalog");
  if (bErr) fail(`catalog bucket bulunamadı: ${bErr.message}`, "migration dosyasının storage bölümünü çalıştırın");
  else bucket.public ? ok("catalog bucket (herkese açık)") : fail("catalog bucket herkese açık değil");
  // 1×1 PNG: an allowed MIME type, so only the access rule can reject it
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==", "base64");
  const probe = `_kurulum-testi/${Date.now()}.png`;
  const { error: upErr } = await anon.storage.from("catalog").upload(probe, new Blob([png], { type: "image/png" }), { contentType: "image/png" });
  if (!upErr) {
    fail("ziyaretçi catalog bucket'a dosya yükleyebiliyor!");
    await admin.storage.from("catalog").remove([probe]);
  } else if (/row-level security|unauthorized|403|permission/i.test(`${upErr.message} ${upErr.statusCode ?? ""}`)) ok("ziyaretçi dosya yükleyemiyor");
  else fail(`storage yükleme testinde beklenmeyen hata: ${upErr.message}`);
}

console.log(`\n${failed ? `✗ ${failed} hata` : "✓ Hata yok"}${warned ? `, ${warned} uyarı` : ""}.`);
console.log("Elle kontrol: Authentication → URL Configuration'da Site URL ve /admin/auth/callback yönlendirmesi (README 2.5), realtime için panelde yeni talep bildirimi.");
process.exit(failed ? 1 : 0);
