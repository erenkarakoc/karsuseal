import generated from "@/data/og-images.json";

// Social preview images are pre-rendered by scripts/build-og-images.mjs (next/og does not
// run reliably on Cloudflare Workers). Items created later in the admin fall back to the site image.
const products = new Set(generated.products);
const categories = new Set(generated.categories);

export const OG_DEFAULT = "/og/default.png";
export const ogForProduct = (slug: string) => (products.has(slug) ? `/og/urun/${slug}.png` : OG_DEFAULT);
export const ogForCategory = (slug: string) => (categories.has(slug) ? `/og/urunler/${slug}.png` : OG_DEFAULT);
export const ogImages = (url: string, alt: string) => [{ url, width: 1200, height: 630, alt }];
