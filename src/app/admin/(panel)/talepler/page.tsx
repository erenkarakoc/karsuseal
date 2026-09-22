import Link from "next/link";
import { Search } from "lucide-react";
import { Card, formatDate, KindBadge, PageTitle, selectCls, STATUS_LABEL, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Inquiry, InquiryStatus } from "@/lib/types";

export const metadata = { title: "Talepler" };

const PAGE_SIZE = 25;
type Props = { searchParams: Promise<{ tur?: string; durum?: string; q?: string; sayfa?: string }> };

export default async function InquiriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const page = Math.max(1, Number(sp.sayfa) || 1);

  let query = supabase.from("inquiries").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (sp.tur === "quote" || sp.tur === "contact") query = query.eq("kind", sp.tur);
  if (sp.durum && sp.durum in STATUS_LABEL) query = query.eq("status", sp.durum);
  else query = query.neq("status", "spam");
  if (sp.q?.trim()) {
    const like = `%${sp.q.trim().replace(/[%_,()]/g, " ")}%`;
    query = query.or(`name.ilike.${like},company.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
  }
  const { data, count } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const rows = (data ?? []) as Inquiry[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ ...sp, ...patch }).filter(([, v]) => v) as [string, string][]);
    return `?${p.toString()}`;
  };

  return (
    <>
      <PageTitle title="Talepler" description={`${count ?? 0} kayıt`} />

      <Card className="mb-4 p-3">
        <form className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input name="q" defaultValue={sp.q} placeholder="Ad, firma, e-posta, telefon" className="py-2 ps-9 pe-3 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground focus:border-primary-focus focus:ring-primary-focus" />
          </div>
          <select name="tur" defaultValue={sp.tur ?? ""} className={selectCls} aria-label="Tür">
            <option value="">Tüm türler</option>
            <option value="quote">Teklif</option>
            <option value="contact">İletişim</option>
          </select>
          <select name="durum" defaultValue={sp.durum ?? ""} className={selectCls} aria-label="Durum">
            <option value="">Tüm durumlar</option>
            {(Object.keys(STATUS_LABEL) as InquiryStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <button className="py-2 px-4 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Filtrele</button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-divider text-sm">
            <thead className="bg-muted/50">
              <tr className="text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground-1">
                <th className="px-4 py-3 text-start">Tarih</th>
                <th className="px-4 py-3 text-start">Tür</th>
                <th className="px-4 py-3 text-start">Kişi / firma</th>
                <th className="px-4 py-3 text-start">İçerik</th>
                <th className="px-4 py-3 text-start">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-divider">
              {rows.map((i) => (
                <tr key={i.id} className={`hover:bg-muted-hover ${i.status === "new" ? "font-medium" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground-2"><Link href={`/admin/talepler/${i.id}`} className="block">{formatDate(i.created_at)}</Link></td>
                  <td className="px-4 py-3"><KindBadge kind={i.kind} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/talepler/${i.id}`} className="block text-foreground hover:text-primary">{i.name}</Link>
                    <span className="block text-xs text-muted-foreground-1">{[i.company, i.email].filter(Boolean).join(" · ")}</span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground-2"><span className="line-clamp-2">{i.items.length ? i.items.map((x) => `${x.code} ×${x.quantity}`).join(", ") : i.subject || i.message}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground-1">Kayıt bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-card-divider px-4 py-3 text-sm">
            <span className="text-muted-foreground-1">Sayfa {page} / {pages}</span>
            <div className="flex gap-2">
              {page > 1 && <Link href={qs({ sayfa: String(page - 1) })} className="rounded-lg border border-layer-line px-3 py-1.5 hover:bg-layer-hover">Önceki</Link>}
              {page < pages && <Link href={qs({ sayfa: String(page + 1) })} className="rounded-lg border border-layer-line px-3 py-1.5 hover:bg-layer-hover">Sonraki</Link>}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
