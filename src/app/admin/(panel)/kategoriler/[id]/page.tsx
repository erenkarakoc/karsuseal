import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Category } from "@/lib/types";

export const metadata = { title: "Kategori düzenle" };

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  const categories = (data ?? []) as Category[];
  const category = id === "yeni" ? undefined : categories.find((c) => c.id === id);
  if (id !== "yeni" && !category) notFound();

  return (
    <>
      <Link href="/admin/kategoriler" className="mb-4 inline-flex items-center gap-x-1.5 text-sm text-muted-foreground-1 hover:text-foreground"><ArrowLeft className="size-4" /> Kategoriler</Link>
      <PageTitle title={category?.name ?? "Yeni kategori"} />
      <CategoryForm key={category?.id ?? "new"} category={category} parents={categories.filter((c) => !c.parent_id && c.id !== category?.id)} />
    </>
  );
}
