import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Landing URL for Supabase e-mail links (password reset, admin invitation).
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = url.searchParams.get("next")?.startsWith("/admin") ? url.searchParams.get("next")! : "/admin";
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };

  return NextResponse.redirect(new URL(error ? "/admin/giris?hata=baglanti" : next, url.origin));
}
