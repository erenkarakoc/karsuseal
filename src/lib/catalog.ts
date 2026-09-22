import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { Category, CategoryNode, Product, ProductCard, PublicSettings } from "@/lib/types";

const CARD_COLUMNS = "id, slug, code, name, summary, illustration, image_url, category_id";

// ---------------------------------------------------------------------------
// Local fallback: until Supabase is configured the site renders the bundled
// seed catalog, so the storefront can be previewed without a database.
// ---------------------------------------------------------------------------
type Source = { categories: Category[]; products: Product[] };

const localSource = cache(async (): Promise<Source> => {
  const data = await import("@/data/catalog.mjs");
  const categories: Category[] = [];
  data.categories.forEach((c, i) => {
    categories.push({ id: c.slug, parent_id: null, slug: c.slug, name: c.name, summary: c.summary, description: c.description, illustration: c.illustration, image_url: null, sort_order: i * 10, is_published: true });
    c.children.forEach((ch, j) =>
      categories.push({ id: ch.slug, parent_id: c.slug, slug: ch.slug, name: ch.name, summary: ch.summary, description: null, illustration: ch.illustration, image_url: null, sort_order: j * 10, is_published: true }),
    );
  });
  const now = new Date(0).toISOString();
  const products: Product[] = data.products.map((p, i) => ({
    id: slugify(p.code), category_id: p.category, slug: slugify(p.code), code: p.code, name: p.name,
    summary: p.summary, description: p.description, specs: p.specs, materials: p.materials,
    features: p.features, applications: p.applications, standards: p.standards, equivalents: p.equivalents,
    industries: p.industries, illustration: p.illustration, image_url: null, gallery: [], datasheet_url: null,
    is_published: true, is_featured: Boolean(p.is_featured), sort_order: i * 10, created_at: now, updated_at: now,
  }));
  return { categories, products };
});

const toCard = (p: Product): ProductCard => ({ id: p.id, slug: p.slug, code: p.code, name: p.name, summary: p.summary, illustration: p.illustration, image_url: p.image_url, category_id: p.category_id });

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) return (await localSource()).categories;
  const { data, error } = await createPublicClient().from("categories").select("*").eq("is_published", true).order("sort_order");
  if (error) throw error;
  return data as Category[];
});

export const getCategoryTree = cache(async (): Promise<CategoryNode[]> => {
  const all = await getCategories();
  const byParent = new Map<string | null, Category[]>();
  for (const c of all) byParent.set(c.parent_id, [...(byParent.get(c.parent_id) ?? []), c]);
  const build = (parent: string | null): CategoryNode[] =>
    (byParent.get(parent) ?? []).sort((a, b) => a.sort_order - b.sort_order).map((c) => ({ ...c, children: build(c.id) }));
  return build(null);
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const all = await getCategories();
  const category = all.find((c) => c.slug === slug);
  if (!category) return null;
  const parent = category.parent_id ? all.find((c) => c.id === category.parent_id) ?? null : null;
  const children = all.filter((c) => c.parent_id === category.id).sort((a, b) => a.sort_order - b.sort_order);
  const siblings = parent ? all.filter((c) => c.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order) : [];
  return { category, parent, children, siblings };
});

/** Products in the given categories (a parent category includes its children). */
export async function getProductsForCategory(categoryId: string): Promise<ProductCard[]> {
  const all = await getCategories();
  const ids = [categoryId, ...all.filter((c) => c.parent_id === categoryId).map((c) => c.id)];
  if (!isSupabaseConfigured()) {
    return (await localSource()).products.filter((p) => ids.includes(p.category_id)).map(toCard);
  }
  const { data, error } = await createPublicClient().from("products").select(CARD_COLUMNS).in("category_id", ids).eq("is_published", true).order("sort_order");
  if (error) throw error;
  return data as ProductCard[];
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return (await localSource()).products.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient().from("products").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) throw error;
  return data as Product | null;
});

export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  if (!isSupabaseConfigured()) return (await localSource()).products.filter((p) => p.is_featured).slice(0, limit).map(toCard);
  const { data, error } = await createPublicClient().from("products").select(CARD_COLUMNS).eq("is_featured", true).eq("is_published", true).order("sort_order").limit(limit);
  if (error) throw error;
  return data as ProductCard[];
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<ProductCard[]> {
  if (!isSupabaseConfigured()) {
    return (await localSource()).products.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, limit).map(toCard);
  }
  const { data, error } = await createPublicClient().from("products").select(CARD_COLUMNS).eq("category_id", product.category_id).eq("is_published", true).neq("id", product.id).order("sort_order").limit(limit);
  if (error) throw error;
  return data as ProductCard[];
}

export async function getProductsByIndustry(industry: string, limit = 12): Promise<ProductCard[]> {
  if (!isSupabaseConfigured()) return (await localSource()).products.filter((p) => p.industries.includes(industry)).slice(0, limit).map(toCard);
  const { data, error } = await createPublicClient().from("products").select(CARD_COLUMNS).contains("industries", [industry]).eq("is_published", true).order("sort_order").limit(limit);
  if (error) throw error;
  return data as ProductCard[];
}

export async function searchProducts(query: string, limit = 40): Promise<ProductCard[]> {
  const q = query.trim();
  if (!q) return [];
  if (!isSupabaseConfigured()) {
    const needle = q.toLocaleLowerCase("tr");
    return (await localSource()).products
      .filter((p) => [p.code, p.name, p.summary ?? "", ...p.equivalents].join(" ").toLocaleLowerCase("tr").includes(needle))
      .slice(0, limit)
      .map(toCard);
  }
  const like = `%${q.replace(/[%_,()]/g, " ")}%`;
  const { data, error } = await createPublicClient()
    .from("products")
    .select(CARD_COLUMNS)
    .eq("is_published", true)
    .or(`code.ilike.${like},name.ilike.${like},summary.ilike.${like}`)
    .order("sort_order")
    .limit(limit);
  if (error) throw error;
  return data as ProductCard[];
}

export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  const fallback: PublicSettings = {
    company_phone: "+90 (000) 000 00 00",
    company_whatsapp: null,
    company_email: "info@karsuseal.com",
    company_address: "İstanbul, Türkiye",
    company_maps_url: null,
    working_hours: "Hafta içi 08:30 – 18:00",
  };
  if (!isSupabaseConfigured()) return fallback;
  const { data } = await createPublicClient().from("public_settings").select("*").maybeSingle();
  if (!data) return fallback;
  return Object.fromEntries(Object.entries(fallback).map(([k, v]) => [k, (data as Record<string, string | null>)[k] || v])) as PublicSettings;
});

export async function getAllProductSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!isSupabaseConfigured()) return (await localSource()).products.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  const { data } = await createPublicClient().from("products").select("slug, updated_at").eq("is_published", true);
  return data ?? [];
}
