import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero, ProductGrid } from "@/components/site/ui";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Ürün Ara", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);
  return (
    <>
      <PageHero title={q ? `“${q}” için sonuçlar` : "Ürün ara"} breadcrumbs={[{ href: "/urunler", label: "Ürünler" }, { label: "Arama" }]}>
        <form action="/arama" className="mt-8 flex max-w-xl gap-2" role="search">
          <label htmlFor="q" className="sr-only">Ürün ara</label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Ürün kodu, tip veya muadil model" className="py-3 ps-10 pe-4 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus" />
          </div>
          <button className="py-3 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover">Ara</button>
        </form>
      </PageHero>
      <section className="container-page py-10 md:py-14">
        {q ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground-1">{results.length} ürün bulundu</p>
            {results.length ? (
              <ProductGrid products={results} />
            ) : (
              <p className="rounded-xl border border-dashed border-line-3 p-10 text-center text-muted-foreground-1">
                Sonuç bulunamadı. Farklı bir kod deneyin veya <Link href="/teklif-al" className="font-semibold text-primary hover:underline">teklif formundan</Link> ihtiyacınızı yazın.
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground-1">Ürün kodunu, tipini (ör. “kartuş”) veya muadil modeli (ör. “MG1”) yazın.</p>
        )}
      </section>
    </>
  );
}
