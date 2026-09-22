import Link from "next/link";
import { ArrowRight, BellRing, ClipboardList, Inbox, Mail, Package } from "lucide-react";
import { Card, formatDate, KindBadge, PageTitle, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Inquiry } from "@/lib/types";

export const metadata = { title: "Genel bakış" };

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const [newCount, quoteMonth, products, latest, settings, pushCount] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("kind", "quote").gte("created_at", monthStart),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("settings").select("notification_emails, email_notifications, push_notifications").eq("id", 1).single(),
    supabase.from("push_subscriptions").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Yeni talepler", value: newCount.count ?? 0, icon: Inbox, href: "/admin/talepler?durum=new" },
    { label: "Bu ay teklif talebi", value: quoteMonth.count ?? 0, icon: ClipboardList, href: "/admin/talepler?tur=quote" },
    { label: "Katalogdaki ürün", value: products.count ?? 0, icon: Package, href: "/admin/urunler" },
  ];
  const emails = settings.data?.notification_emails ?? [];

  return (
    <>
      <PageTitle title="Genel bakış" description="Gelen talepler ve katalog özeti" />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group">
            <Card className="p-5 transition group-hover:border-primary-300">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground-1">{label}</p>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground">{value}</p>
            </Card>
          </Link>
        ))}
      </div>

      {(emails.length === 0 || (pushCount.count ?? 0) === 0) && (
        <Card className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <BellRing className="size-6 shrink-0 text-amber-500" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-foreground">Bildirim kurulumu eksik</p>
            <p className="mt-0.5 text-muted-foreground-2">
              {emails.length === 0 && "Bildirim e-posta adresi eklenmedi. "}
              {(pushCount.count ?? 0) === 0 && "Hiçbir cihazda tarayıcı bildirimi açık değil."}
            </p>
          </div>
          <Link href="/admin/ayarlar" className="inline-flex items-center gap-x-1 text-sm font-semibold text-primary hover:underline">Ayarlara git <ArrowRight className="size-4" /></Link>
        </Card>
      )}

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-card-divider px-5 py-4">
          <h2 className="font-display font-semibold text-foreground">Son talepler</h2>
          <Link href="/admin/talepler" className="text-sm font-semibold text-primary hover:underline">Tümü</Link>
        </div>
        {latest.data?.length ? (
          <ul className="divide-y divide-card-divider">
            {(latest.data as Inquiry[]).map((i) => (
              <li key={i.id}>
                <Link href={`/admin/talepler/${i.id}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-muted-hover sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-x-3">
                    <KindBadge kind={i.kind} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{i.name}{i.company ? ` · ${i.company}` : ""}</p>
                      <p className="truncate text-xs text-muted-foreground-1">{i.items.length ? i.items.map((x) => x.code).join(", ") : i.subject || i.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <StatusBadge status={i.status} />
                    <span className="text-xs text-muted-foreground-1 whitespace-nowrap">{formatDate(i.created_at)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center text-sm text-muted-foreground-1">
            <Mail className="size-8" /> Henüz talep yok. İletişim ve teklif formlarından gelen talepler burada görünecek.
          </div>
        )}
      </Card>
    </>
  );
}
