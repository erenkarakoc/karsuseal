import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentEditor } from "@/components/admin/content-editor";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { mergeContent } from "@/lib/content/merge";
import { DEFAULT_CONTENT, HOME_SECTIONS, type ContentKey } from "@/lib/content/defaults";
import { schemaFor } from "@/lib/content/schema";
import type { Category } from "@/lib/types";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props) {
  const { key } = await params;
  return { title: schemaFor(key)?.title ?? "İçerik" };
}

export default async function ContentEditPage({ params }: Props) {
  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) notFound();
  const { supabase } = await requireAdmin();
  const [{ data: row }, { data: cats }] = await Promise.all([
    supabase.from("site_content").select("content, updated_at").eq("key", key).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const categories = (cats ?? []) as Category[];
  const bySlug = new Map(categories.map((c) => [c.id, c.slug]));
  const initial = mergeContent(DEFAULT_CONTENT[key as ContentKey], row?.content) as Record<string, unknown>;
  if (key === "ana-sayfa") {
    const order = (initial.order as string[]).filter((s) => (HOME_SECTIONS as readonly string[]).includes(s));
    for (const s of HOME_SECTIONS) if (!order.includes(s)) order.push(s);
    initial.order = order;
  }

  return (
    <>
      <Link href="/admin/icerik" className="mb-4 inline-flex items-center gap-x-1.5 text-sm text-muted-foreground-1 hover:text-foreground"><ArrowLeft className="size-4" /> Sayfa içerikleri</Link>
      <PageTitle title={schema.title} description={schema.description} />
      <ContentEditor
        key={row?.updated_at ?? "default"}
        schema={schema}
        initial={initial}
        isCustomized={Boolean(row)}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name, parent: c.parent_id ? bySlug.get(c.parent_id) ?? null : null }))}
      />
    </>
  );
}
