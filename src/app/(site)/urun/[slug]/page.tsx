import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, FileText, Gauge, Ruler, Thermometer, Zap, MoveHorizontal } from "lucide-react";
import { AddToQuoteButton } from "@/components/site/quote-cart";
import { ProductGallery } from "@/components/site/product-gallery";
import { Breadcrumbs, ProductGrid, SectionHeading, btn } from "@/components/site/ui";
import { CtaBand } from "@/components/site/cta-band";
import { getCategoryBySlug, getCategories, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/env";
import { imageFor } from "@/lib/images";
import { ogForProduct, ogImages } from "@/lib/og";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.summary ?? undefined, openGraph: { images: ogImages(ogForProduct(p.slug), p.name) } };
}

const SPEC_ICON = (label: string) => {
  const l = label.toLocaleLowerCase("tr");
  if (l.includes("çap") || l.includes("ölçü") || l.includes("bağlantı")) return Ruler;
  if (l.includes("basınç")) return Gauge;
  if (l.includes("sıcaklık")) return Thermometer;
  if (l.includes("hız") || l.includes("devir")) return Zap;
  if (l.includes("hareket")) return MoveHorizontal;
  return CircleCheck;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const catData = category ? await getCategoryBySlug(category.slug) : null;
  const related = await getRelatedProducts(product, 4);
  const image = imageFor(product);
  const gallery = [...new Set([image, ...(product.gallery ?? [])])];
  const keySpecs = product.specs.slice(0, 4);
  const productIndustries = (await getContent("sektorler")).items.filter((i) => product.industries.includes(i.slug));
  const displayName = product.name.replace(`${product.code} `, "");

  const tabs = [
    { id: "ozellikler", label: "Teknik özellikler", show: product.specs.length > 0 },
    { id: "malzemeler", label: "Malzemeler", show: product.materials.length > 0 },
    { id: "uygulamalar", label: "Uygulama alanları", show: product.applications.length > 0 },
    { id: "aciklama", label: "Açıklama", show: Boolean(product.description) },
  ].filter((t) => t.show);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    description: product.summary,
    image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
    brand: { "@type": "Brand", name: "Karsu Seal" },
    category: category?.name,
    additionalProperty: product.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line-2 bg-surface">
        <div className="container-page py-5">
          <Breadcrumbs
            items={[
              { href: "/urunler", label: "Ürünler" },
              ...(catData?.parent ? [{ href: `/urunler/${catData.parent.slug}`, label: catData.parent.name }] : []),
              ...(category ? [{ href: `/urunler/${category.slug}`, label: category.name }] : []),
              { label: product.code },
            ]}
          />
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Media */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <ProductGallery images={gallery} alt={product.name} isIllustration={!product.image_url} />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-6">
            <p className="inline-flex items-center rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 font-mono text-xs font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-200">
              {product.code}
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-foreground">{displayName}</h1>
            {product.summary && <p className="mt-4 text-lg text-muted-foreground-2">{product.summary}</p>}

            {keySpecs.length > 0 && (
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {keySpecs.map((s) => {
                  const Icon = SPEC_ICON(s.label);
                  return (
                    <div key={s.label} className="flex gap-x-3 rounded-xl border border-card-line bg-card p-4">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                        <Icon className="size-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs font-medium text-muted-foreground-1">{s.label}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/teklif-al?urun=${product.slug}`} className={btn.primary}>
                Fiyat teklifi al <ArrowRight className="size-4" />
              </Link>
              <AddToQuoteButton item={{ product_id: product.id, slug: product.slug, code: product.code, name: product.name, image }} />
              {product.datasheet_url && (
                <a href={product.datasheet_url} target="_blank" rel="noreferrer" className={btn.secondary}>
                  <FileText className="size-4" /> Teknik föy
                </a>
              )}
            </div>

            {product.features.length > 0 && (
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-x-2.5 text-sm text-muted-foreground-2">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {(product.equivalents.length > 0 || product.standards.length > 0) && (
              <div className="mt-8 grid gap-4 border-t border-line-2 pt-6 sm:grid-cols-2">
                {product.standards.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Standartlar</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.standards.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground-2">{s}</span>)}
                    </div>
                  </div>
                )}
                {product.equivalents.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Muadil tipler</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.equivalents.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground-2">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {productIndustries.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Sektörler</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {productIndustries.map((i) => (
                    <Link key={i.slug} href={`/sektorler/${i.slug}`} className="rounded-full border border-line-2 px-3 py-1 text-xs font-medium text-muted-foreground-2 hover:border-primary hover:text-primary">
                      {i.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details tabs */}
      {tabs.length > 0 && (
        <section className="border-y border-line-2 bg-surface">
          <div className="container-page py-10 md:py-14">
            <nav className="flex gap-x-1 overflow-x-auto border-b border-line-2" aria-label="Ürün detayları" role="tablist" aria-orientation="horizontal" data-hs-tabs="">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`hs-tab-active:border-primary hs-tab-active:text-primary -mb-px whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-muted-foreground-1 hover:text-primary focus:outline-hidden ${i === 0 ? "active" : ""}`}
                  id={`tab-${t.id}`}
                  aria-selected={i === 0}
                  data-hs-tab={`#panel-${t.id}`}
                  aria-controls={`panel-${t.id}`}
                  role="tab"
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              {product.specs.length > 0 && (
                <div id="panel-ozellikler" role="tabpanel" aria-labelledby="tab-ozellikler" className={tabs[0].id === "ozellikler" ? "" : "hidden"}>
                  <div className="overflow-hidden rounded-xl border border-card-line bg-card">
                    <table className="min-w-full divide-y divide-card-divider text-sm">
                      <caption className="sr-only">{product.code} teknik özellikleri</caption>
                      <tbody className="divide-y divide-card-divider">
                        {product.specs.map((s) => (
                          <tr key={s.label}>
                            <th scope="row" className="w-2/5 px-5 py-3.5 text-start font-medium text-muted-foreground-2 align-top">{s.label}</th>
                            <td className="px-5 py-3.5 font-semibold text-foreground">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground-1">
                    Değerler tipik çalışma limitleridir; kesin limitler malzeme kombinasyonu, akışkan ve mil çapına göre değişir. Uygulamanıza özel seçim için teknik ekibimize danışın.
                  </p>
                </div>
              )}

              {product.materials.length > 0 && (
                <div id="panel-malzemeler" role="tabpanel" aria-labelledby="tab-malzemeler" className="hidden">
                  <div className="grid gap-4 md:grid-cols-2">
                    {product.materials.map((m) => (
                      <div key={m.part} className="rounded-xl border border-card-line bg-card p-5">
                        <h3 className="font-display font-semibold text-foreground">{m.part}</h3>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {m.options.map((o) => <span key={o} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground-2">{o}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.applications.length > 0 && (
                <div id="panel-uygulamalar" role="tabpanel" aria-labelledby="tab-uygulamalar" className={tabs[0].id === "uygulamalar" ? "" : "hidden"}>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {product.applications.map((a) => (
                      <li key={a} className="flex gap-x-3 rounded-xl border border-card-line bg-card p-4 text-sm font-medium text-foreground">
                        <CircleCheck className="size-5 shrink-0 text-primary" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description && (
                <div id="panel-aciklama" role="tabpanel" aria-labelledby="tab-aciklama" className="hidden">
                  <div className="prose-karsu max-w-3xl">
                    {product.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-page py-14 md:py-20">
          <SectionHeading title="Benzer ürünler" action={category ? { href: `/urunler/${category.slug}`, label: `Tüm ${category.name}` } : undefined} />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
