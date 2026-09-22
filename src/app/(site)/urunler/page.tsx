import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/site/ui";
import { CtaBand } from "@/components/site/cta-band";
import { getCategoryTree } from "@/lib/catalog";
import { imageFor } from "@/lib/images";

export const metadata: Metadata = {
  title: "Ürün Kataloğu",
  description: "Mekanik salmastralar, kartuş ve mikser salmastraları, döner başlıklar, yumuşak salmastralar, PTFE, conta ve O-ring ürünleri.",
};

export default async function ProductsIndexPage() {
  const tree = await getCategoryTree();
  return (
    <>
      <PageHero
        eyebrow="Ürün kataloğu"
        title="Sızdırmazlık ürünleri"
        description="Ürün grubunu seçin veya ürün kodu, tip adı ya da muadil model ile arayın."
        breadcrumbs={[{ label: "Ürünler" }]}
      >
        <form action="/arama" className="mt-8 flex max-w-xl gap-2" role="search">
          <label htmlFor="q" className="sr-only">Ürün ara</label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input id="q" name="q" type="search" placeholder="Örn. KS-M7, MG1, kartuş, O-ring…" className="py-3 ps-10 pe-4 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus" />
          </div>
          <button className="py-3 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-hidden">Ara</button>
        </form>
      </PageHero>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tree.map((c) => (
            <div key={c.id} className="group flex flex-col overflow-hidden rounded-xl border border-card-line bg-card hover:shadow-md transition">
              <Link href={`/urunler/${c.slug}`} className="block aspect-[16/9] overflow-hidden bg-[#eef2f7] focus:outline-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageFor(c)} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-semibold text-foreground">
                  <Link href={`/urunler/${c.slug}`} className="hover:text-primary focus:outline-hidden focus:text-primary">{c.name}</Link>
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground-1">{c.summary}</p>
                {c.children.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.children.map((ch) => (
                      <Link key={ch.id} href={`/urunler/${ch.slug}`} className="inline-flex items-center rounded-full border border-line-2 px-3 py-1 text-xs font-medium text-muted-foreground-2 hover:border-primary hover:text-primary">
                        {ch.name}
                      </Link>
                    ))}
                  </div>
                )}
                <Link href={`/urunler/${c.slug}`} className="mt-auto pt-5 inline-flex items-center gap-x-1 text-sm font-semibold text-primary hover:underline">
                  Ürünleri gör <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
