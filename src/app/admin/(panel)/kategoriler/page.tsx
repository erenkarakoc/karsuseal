import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { adminBtn, Card, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { imageFor } from "@/lib/images";
import type { Category } from "@/lib/types";

export const metadata = { title: "Kategoriler" };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("category_id"),
  ]);
  const categories = (cats ?? []) as Category[];
  const counts = new Map<string, number>();
  for (const p of prods ?? []) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  const parents = categories.filter((c) => !c.parent_id);

  const Row = ({ c, child = false }: { c: Category; child?: boolean }) => (
    <Link href={`/admin/kategoriler/${c.id}`} className={`flex items-center gap-x-3 px-4 py-3 hover:bg-muted-hover ${child ? "ps-12" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageFor(c)} alt="" className="size-10 shrink-0 rounded-md border border-card-line object-cover bg-[#eef2f7]" loading="lazy" />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm ${child ? "text-foreground" : "font-semibold text-foreground"}`}>{c.name}</span>
        <span className="block truncate text-xs text-muted-foreground-1">/urunler/{c.slug}</span>
      </span>
      {!c.is_published && <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground-2">Gizli</span>}
      <span className="text-xs text-muted-foreground-1 whitespace-nowrap">{counts.get(c.id) ?? 0} ürün</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );

  return (
    <>
      <PageTitle title="Kategoriler" description={`${categories.length} kategori`} actions={<Link href="/admin/kategoriler/yeni" className={adminBtn.primary}><Plus className="size-4" /> Yeni kategori</Link>} />
      <Card className="divide-y divide-card-divider overflow-hidden">
        {parents.map((p) => (
          <div key={p.id} className="divide-y divide-card-divider">
            <Row c={p} />
            {categories.filter((c) => c.parent_id === p.id).map((c) => <Row key={c.id} c={c} child />)}
          </div>
        ))}
        {!categories.length && <p className="px-4 py-12 text-center text-sm text-muted-foreground-1">Henüz kategori yok. supabase/seed.sql dosyasını çalıştırarak başlangıç kataloğunu yükleyebilirsiniz.</p>}
      </Card>
    </>
  );
}
