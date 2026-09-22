import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Category, Product } from "@/lib/types";
import { getContent } from "@/lib/content";

export const metadata = { title: "Ürün düzenle" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const isNew = id === "yeni";
  const [{ data: cats }, productRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    isNew ? Promise.resolve({ data: null }) : supabase.from("products").select("*").eq("id", id).maybeSingle(),
  ]);
  const product = productRes.data as Product | null;
  if (!isNew && !product) notFound();

  return (
    <>
      <Link href="/admin/urunler" className="mb-4 inline-flex items-center gap-x-1.5 text-sm text-muted-foreground-1 hover:text-foreground"><ArrowLeft className="size-4" /> Ürünler</Link>
      <PageTitle title={product ? product.name : "Yeni ürün"} />
      <ProductForm product={product ?? undefined} categories={(cats ?? []) as Category[]} industries={(await getContent("sektorler")).items.map(({ slug, name }) => ({ slug, name }))} />
    </>
  );
}
