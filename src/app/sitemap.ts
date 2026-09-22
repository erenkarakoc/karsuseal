import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/catalog";
import { SITE_URL } from "@/lib/env";
import { industries } from "@/data/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getAllProductSlugs()]);
  const staticPages = ["", "/urunler", "/sektorler", "/hizmetler", "/kurumsal", "/iletisim", "/teklif-al"];
  return [
    ...staticPages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${SITE_URL}/urunler/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/urun/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...industries.map((i) => ({ url: `${SITE_URL}/sektorler/${i.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
