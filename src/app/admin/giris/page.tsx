import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Yönetim Paneli Girişi", robots: { index: false } };

type Props = { searchParams: Promise<{ hata?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { hata } = await searchParams;
  const session = await getAdmin();
  if (session?.isAdmin) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center"><Logo className="h-10 w-auto" /></div>
        <div className="mt-8 rounded-2xl border border-card-line bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold text-foreground">Yönetim paneli</h1>
          <p className="mt-1 text-sm text-muted-foreground-1">Devam etmek için giriş yapın.</p>
          {!isSupabaseConfigured() ? (
            <p className="mt-6 break-words rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              Supabase bağlantısı yapılandırılmamış. <code className="font-mono break-all">NEXT_PUBLIC_SUPABASE_URL</code> ve <code className="font-mono break-all">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> değişkenlerini tanımlayın (README → Kurulum).
            </p>
          ) : (
            <LoginForm error={hata === "yetki" ? "Bu hesabın yönetim paneline erişim yetkisi yok." : hata === "baglanti" ? "Bağlantı geçersiz veya süresi dolmuş." : undefined} />
          )}
        </div>
      </div>
    </main>
  );
}
