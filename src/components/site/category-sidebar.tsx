import Link from "next/link";
import type { CategoryNode } from "@/lib/types";

/** Catalog navigation: highlights the active category and opens its branch. */
export function CategorySidebar({ tree, activeSlug }: { tree: CategoryNode[]; activeSlug?: string }) {
  const item = (active: boolean) =>
    `flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
      active ? "bg-primary-50 font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200" : "text-muted-foreground-2 hover:bg-muted-hover hover:text-foreground"
    } focus:outline-hidden focus:bg-muted-focus`;
  return (
    <nav aria-label="Ürün kategorileri" className="space-y-0.5">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground-1">Kategoriler</p>
      {tree.map((c) => {
        const open = c.slug === activeSlug || c.children.some((ch) => ch.slug === activeSlug);
        return (
          <div key={c.id}>
            <Link href={`/urunler/${c.slug}`} className={item(c.slug === activeSlug)} aria-current={c.slug === activeSlug ? "page" : undefined}>
              {c.name}
            </Link>
            {open && c.children.length > 0 && (
              <div className="ms-3 border-s border-line-2 ps-2 py-1 space-y-0.5">
                {c.children.map((ch) => (
                  <Link key={ch.id} href={`/urunler/${ch.slug}`} className={item(ch.slug === activeSlug)} aria-current={ch.slug === activeSlug ? "page" : undefined}>
                    {ch.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
