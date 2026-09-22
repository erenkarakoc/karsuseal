import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { IndustryIcon } from "@/components/site/industry-icon";
import { CtaBand, PageHero, ProductGrid, SectionHeading } from "@/components/site/ui";
import { getCategories, getProductsByIndustry } from "@/lib/catalog";
import { imageFor } from "@/lib/images";
import { industries, industryDetails } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  return ind ? { title: `${ind.name} Sektörü`, description: ind.summary } : {};
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  const detail = industryDetails[slug];
  const [products, categories] = await Promise.all([getProductsByIndustry(slug, 8), getCategories()]);
  const cats = (detail?.categories ?? []).map((s) => categories.find((c) => c.slug === s)).filter((c) => c !== undefined);

  return (
    <>
      <PageHero eyebrow="Sektör" title={ind.name} description={ind.summary} breadcrumbs={[{ href: "/sektorler", label: "Sektörler" }, { label: ind.name }]}>
        <span className="absolute end-8 top-1/2 hidden -translate-y-1/2 lg:inline-flex size-28 items-center justify-center rounded-3xl bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
          <IndustryIcon slug={slug} className="size-14" />
        </span>
      </PageHero>

      {detail && (
        <section className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-semibold text-foreground">Sık karşılaşılan sorunlar</h2>
              <ul className="mt-5 space-y-3">
                {detail.challenges.map((c) => (
                  <li key={c} className="flex gap-x-3 rounded-xl border border-card-line bg-card p-4 text-sm text-foreground">
                    <TriangleAlert className="size-5 shrink-0 text-amber-500" /> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-semibold text-foreground">Önerilen ürün grupları</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {cats.map((c) => (
                  <Link key={c.id} href={`/urunler/${c.slug}`} className="group flex gap-x-4 rounded-xl border border-card-line bg-card p-3 hover:border-primary-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageFor(c)} alt="" className="size-20 shrink-0 rounded-lg object-cover bg-[#eef2f7]" />
                    <span className="min-w-0 py-1">
                      <span className="block font-display font-semibold text-foreground group-hover:text-primary">{c.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground-1 line-clamp-2">{c.summary}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="border-t border-line-2 bg-surface py-12 md:py-16">
          <div className="container-page">
            <SectionHeading title={`${ind.name} için öne çıkan ürünler`} action={{ href: "/urunler", label: "Tüm katalog" }} />
            <div className="mt-8"><ProductGrid products={products} /></div>
            <Link href="/teklif-al" className="mt-10 inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline">
              Uygulamanız için ürün önerisi isteyin <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
