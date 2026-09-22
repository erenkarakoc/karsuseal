import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ProductToggle } from "@/components/admin/product-toggle";
import { adminBtn, Card, PageTitle, selectCls } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { imageFor } from "@/lib/images";
import type { Category, Product } from "@/lib/types";

export const metadata = { title: "Ürünler" };

type Props = { searchParams: Promise<{ q?: string; kategori?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: cats } = await supabase.from("categories").select("*").order("sort_order");
  const categories = (cats ?? []) as Category[];

  let query = supabase.from("products").select("id, slug, code, name, category_id, illustration, image_url, is_published, is_featured, sort_order").order("sort_order");
  if (sp.kategori) {
    const ids = [sp.kategori, ...categories.filter((c) => c.parent_id === sp.kategori).map((c) => c.id)];
    query = query.in("category_id", ids);
  }
  if (sp.q?.trim()) {
    const like = `%${sp.q.trim().replace(/[%_,()]/g, " ")}%`;
    query = query.or(`code.ilike.${like},name.ilike.${like}`);
  }
  const { data } = await query;
  const products = (data ?? []) as Pick<Product, "id" | "slug" | "code" | "name" | "category_id" | "illustration" | "image_url" | "is_published" | "is_featured" | "sort_order">[];
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";
  const parents = categories.filter((c) => !c.parent_id);

  return (
    <>
      <PageTitle title="Ürünler" description={`${products.length} ürün`} actions={<Link href="/admin/urunler/yeni" className={adminBtn.primary}><Plus className="size-4" /> Yeni ürün</Link>} />

      <Card className="mb-4 p-3">
        <form className="grid gap-2 sm:grid-cols-[1fr_16rem_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input name="q" defaultValue={sp.q} placeholder="Kod veya ad" className="py-2 ps-9 pe-3 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground focus:border-primary-focus focus:ring-primary-focus" />
          </div>
          <select name="kategori" defaultValue={sp.kategori ?? ""} className={selectCls} aria-label="Kategori">
            <option value="">Tüm kategoriler</option>
            {parents.map((p) => (
              <optgroup key={p.id} label={p.name}>
                <option value={p.id}>{p.name} (tümü)</option>
                {categories.filter((c) => c.parent_id === p.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
          <button className="py-2 px-4 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover">Filtrele</button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-divider text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-muted-foreground-1">
                <th className="px-4 py-3 text-start">Ürün</th>
                <th className="px-4 py-3 text-start">Kategori</th>
                <th className="px-4 py-3 text-center">Yayında</th>
                <th className="px-4 py-3 text-center">Öne çıkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-divider">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted-hover">
                  <td className="px-4 py-3">
                    <Link href={`/admin/urunler/${p.id}`} className="flex items-center gap-x-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageFor(p)} alt="" className="size-12 shrink-0 rounded-md border border-card-line object-cover bg-[#eef2f7]" loading="lazy" />
                      <span className="min-w-0">
                        <span className="block font-mono text-xs font-semibold text-primary">{p.code}</span>
                        <span className="block truncate font-medium text-foreground hover:text-primary">{p.name.replace(`${p.code} `, "")}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground-2">{catName(p.category_id)}</td>
                  <td className="px-4 py-3 text-center"><ProductToggle id={p.id} field="is_published" value={p.is_published} /></td>
                  <td className="px-4 py-3 text-center"><ProductToggle id={p.id} field="is_featured" value={p.is_featured} /></td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground-1">Ürün bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
