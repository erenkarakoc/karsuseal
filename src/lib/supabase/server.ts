import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, serverEnv } from "@/lib/env";

/** Cookie-aware client acting as the signed-in admin (RLS applies). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component: cookies are read-only there. The browser
          // client in the admin layout keeps the session refreshed instead.
        }
      },
    },
  });
}

/** Anonymous client for public catalog reads (no cookies, RLS: published rows only). */
export function createPublicClient() {
  return createPlainClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Privileged client (bypasses RLS). Only for trusted server code: form intake, notifications. */
export function createServiceClient() {
  const { supabaseSecretKey } = serverEnv();
  if (!supabaseSecretKey) throw new Error("SUPABASE_SECRET_KEY is not configured");
  return createPlainClient(SUPABASE_URL, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
