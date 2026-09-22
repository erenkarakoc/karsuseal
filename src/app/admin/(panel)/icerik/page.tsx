import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, formatDate, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { PAGE_SCHEMAS } from "@/lib/content/schema";

export const metadata = { title: "Sayfa içerikleri" };

export default async function ContentIndexPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_content").select("key, updated_at, updated_by");
  const rows = new Map((data ?? []).map((r) => [r.key, r]));

  return (
    <>
      <PageTitle title="Sayfa içerikleri" description="Sitedeki metinleri, bölümleri ve kartları buradan düzenleyin. Ürün ve kategori içerikleri kendi sayfalarında." />
      {error && (
        <Card className="mb-4 border-amber-300 p-4 text-sm text-amber-800 dark:border-amber-800 dark:text-amber-200">
          İçerik tablosu bulunamadı. Supabase SQL Editor&apos;de <code className="font-mono">supabase/migrations/20260922000000_site_content.sql</code> dosyasını çalıştırın; o zamana kadar site varsayılan metinleri gösterir.
        </Card>
      )}
      <Card className="divide-y divide-card-divider overflow-hidden">
        {PAGE_SCHEMAS.map((p) => {
          const row = rows.get(p.key);
          return (
            <Link key={p.key} href={`/admin/icerik/${p.key}`} className="flex items-center gap-4 px-5 py-4 hover:bg-muted-hover">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="truncate text-sm text-muted-foreground-1">{p.description}</p>
              </div>
              <span className="hidden text-xs text-muted-foreground-1 sm:block">
                {row ? `Düzenlendi · ${formatDate(row.updated_at)}${row.updated_by ? ` · ${row.updated_by}` : ""}` : "Varsayılan"}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          );
        })}
      </Card>
    </>
  );
}
