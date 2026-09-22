import { getCategoryBySlug, getProductsForCategory } from "@/lib/catalog";
import { ogCard, OG_SIZE } from "@/lib/og/card";

export const alt = "Karsu Seal ürün grubu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryBySlug(slug);
  if (!data) return ogCard({ eyebrow: "Karsu Seal", title: "Ürün kataloğu" });
  const products = await getProductsForCategory(data.category.id);
  return ogCard({
    eyebrow: data.parent?.name ?? "Ürün grubu",
    title: data.category.name,
    subtitle: data.category.summary,
    specs: [{ label: "Ürün sayısı", value: String(products.length) }, ...data.children.slice(0, 3).map((c) => ({ label: "Alt grup", value: c.name }))],
  });
}
