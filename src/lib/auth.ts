import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** Current admin session, or null when not signed in / not on the admin list. */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { supabase, user, isAdmin: false as const };
  return { supabase, user, isAdmin: true as const };
});

/** Guards admin pages and server actions. */
export async function requireAdmin() {
  const session = await getAdmin();
  if (!session) redirect("/admin/giris");
  if (!session.isAdmin) redirect("/admin/giris?hata=yetki");
  return session;
}
