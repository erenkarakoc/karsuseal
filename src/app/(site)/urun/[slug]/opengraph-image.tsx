import { getCategories, getProductBySlug } from "@/lib/catalog";
import { ogCard, OG_SIZE } from "@/lib/og/card";

export const alt = "Karsu Seal ürün";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return ogCard({ eyebrow: "Karsu Seal", title: "Ürün bulunamadı" });
  const category = (await getCategories()).find((c) => c.id === product.category_id);
  return ogCard({
    eyebrow: category?.name ?? "Ürün",
    title: product.name.replace(`${product.code} `, ""),
    subtitle: product.summary,
    specs: product.specs,
    badge: product.code,
  });
}
