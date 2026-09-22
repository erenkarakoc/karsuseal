import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategorySidebar } from "@/components/site/category-sidebar";
import { PageHero, ProductGrid } from "@/components/site/ui";
import { CtaBand } from "@/components/site/cta-band";
import { ogForCategory, ogImages } from "@/lib/og";
import { getCategoryBySlug, getCategoryTree, getProductsForCategory } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);
  if (!data) return {};
  return {
    title: data.category.name,
    description: data.category.summary ?? undefined,
    openGraph: { images: ogImages(ogForCategory(data.category.slug), data.category.name) },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);
  if (!data) notFound();
  const { category, parent, children, siblings } = data;
  const [tree, products] = await Promise.all([getCategoryTree(), getProductsForCategory(category.id)]);
  const chips = children.length ? children : siblings;
  const chipParent = children.length ? category : parent;

  return (
    <>
      <PageHero
        eyebrow={parent?.name ?? "Ürün grubu"}
        title={category.name}
        description={category.summary}
        breadcrumbs={[{ href: "/urunler", label: "Ürünler" }, ...(parent ? [{ href: `/urunler/${parent.slug}`, label: parent.name }] : []), { label: category.name }]}
      >
        {chips.length > 0 && chipParent && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href={`/urunler/${chipParent.slug}`}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border ${chipParent.slug === category.slug ? "border-primary bg-primary text-primary-foreground" : "border-line-3 bg-layer text-layer-foreground hover:border-primary hover:text-primary"}`}
            >
              Tümü
            </Link>
            {chips.map((c) => (
              <Link
                key={c.id}
                href={`/urunler/${c.slug}`}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border ${c.slug === category.slug ? "border-primary bg-primary text-primary-foreground" : "border-line-3 bg-layer text-layer-foreground hover:border-primary hover:text-primary"}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </PageHero>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <CategorySidebar tree={tree} activeSlug={category.slug} />
            </div>
          </aside>
          <div className="lg:col-span-9">
            <p className="mb-5 text-sm text-muted-foreground-1">{products.length} ürün</p>
            <div className="[&>div]:xl:grid-cols-3">
              <ProductGrid products={products} />
            </div>
            {category.description && (
              <div className="mt-14 rounded-xl border border-line-2 bg-surface p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground">{category.name} hakkında</h2>
                <div className="prose-karsu mt-3"><p>{category.description}</p></div>
              </div>
            )}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
