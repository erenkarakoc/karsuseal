"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { inputCls } from "@/components/site/forms";

export function LoginForm({ error: initialError }: { error?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [error, setError] = useState(initialError);
  const [info, setInfo] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setPending(true);
    setError(undefined);
    setInfo(undefined);
    const supabase = getBrowserClient();
    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/admin/auth/callback?next=/admin/sifre`,
      });
      setPending(false);
      if (error) setError(error.message);
      else setInfo("Şifre yenileme bağlantısı e-posta adresinize gönderildi.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setPending(false);
      setError(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">{error}</p>}
      {info && <p className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200" role="status">{info}</p>}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">E-posta</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
      </div>
      {mode === "login" && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Şifre</label>
            <button type="button" onClick={() => setMode("reset")} className="text-xs font-medium text-primary hover:underline">Şifremi unuttum</button>
          </div>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
        </div>
      )}
      <button type="submit" disabled={pending} className="w-full py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-60">
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        {mode === "login" ? "Giriş yap" : "Bağlantı gönder"}
      </button>
      {mode === "reset" && (
        <button type="button" onClick={() => setMode("login")} className="w-full text-center text-sm text-muted-foreground-1 hover:text-foreground">Girişe dön</button>
      )}
    </form>
  );
}
