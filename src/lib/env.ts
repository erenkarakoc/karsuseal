// Centralised access to environment variables. `NEXT_PUBLIC_*` values are inlined
// at build time; the rest are Cloudflare Worker secrets read at request time.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export function serverEnv() {
  return {
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? "",
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
    vapidSubject: process.env.VAPID_SUBJECT ?? "mailto:info@karsuseal.com",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    notifyFrom: process.env.NOTIFY_FROM_EMAIL ?? "Karsu Seal <onboarding@resend.dev>",
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY ?? "",
  };
}
