"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FileText, FolderTree, Home, Inbox, LayoutDashboard, Package, Settings } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Genel bakış", icon: LayoutDashboard, exact: true },
  { href: "/admin/talepler", label: "Talepler", icon: Inbox, badge: true },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/icerik/ana-sayfa", label: "Ana sayfa", icon: Home, exact: true },
  { href: "/admin/icerik", label: "Sayfa içerikleri", icon: FileText, except: "/admin/icerik/ana-sayfa" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-y-1 p-3" aria-label="Yönetim menüsü">
      {ITEMS.map(({ href, label, icon: Icon, exact, badge, except }) => {
        const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== except;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium focus:outline-hidden ${
              active ? "bg-sidebar-nav-active text-foreground" : "text-sidebar-nav-foreground hover:bg-sidebar-nav-hover focus:bg-sidebar-nav-focus"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {label}
            {badge && newCount > 0 && (
              <span className="ms-auto inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">{newCount}</span>
            )}
          </Link>
        );
      })}
      <div className="my-2 border-t border-sidebar-line" />
      <Link href="/" target="_blank" className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-nav-foreground hover:bg-sidebar-nav-hover">
        <ExternalLink className="size-4" /> Siteyi görüntüle
      </Link>
    </nav>
  );
}
