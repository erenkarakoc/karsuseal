import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, LogOut, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AdminNav } from "@/components/admin/nav";
import { LiveInquiries } from "@/components/admin/live-inquiries";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = { title: { default: "Yönetim", template: "%s · Yönetim · Karsu Seal" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const { count } = await supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <div className="min-h-dvh bg-background-1">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-x-3 border-b border-navbar-line bg-navbar px-4 lg:hidden">
        <button type="button" className="size-9 inline-flex items-center justify-center rounded-lg border border-layer-line text-layer-foreground" aria-haspopup="dialog" aria-expanded="false" aria-controls="admin-sidebar" aria-label="Menüyü aç" data-hs-overlay="#admin-sidebar">
          <Menu className="size-4" />
        </button>
        <Link href="/admin"><Logo className="h-7 w-auto" /></Link>
      </header>

      {/* Sidebar (Preline overlay on mobile, fixed on desktop) */}
      <aside
        id="admin-sidebar"
        className="hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full hidden fixed top-0 start-0 bottom-0 z-60 bg-sidebar border-e border-sidebar-line"
        role="dialog"
        tabIndex={-1}
        aria-label="Yönetim menüsü"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-5 border-b border-sidebar-line">
            <Link href="/admin" aria-label="Genel bakış"><Logo className="h-8 w-auto" /></Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminNav newCount={count ?? 0} />
          </div>
          <div className="border-t border-sidebar-line p-3">
            <p className="truncate px-3 text-xs text-muted-foreground-1" title={user.email}>{user.email}</p>
            <Link href="/admin/sifre" className="mt-1 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-nav-foreground hover:bg-sidebar-nav-hover">
              <KeyRound className="size-4" /> Şifre değiştir
            </Link>
            <form action={signOut}>
              <button className="mt-1 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-nav-foreground hover:bg-sidebar-nav-hover">
                <LogOut className="size-4" /> Çıkış yap
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:ps-64">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
      <LiveInquiries />
    </div>
  );
}
