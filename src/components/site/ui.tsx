import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { imageFor } from "@/lib/images";
import type { ProductCard as ProductCardType } from "@/lib/types";

// Preline button recipes
export const btn = {
  primary:
    "py-3 px-5 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "py-3 px-5 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-layer-line bg-layer text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus disabled:opacity-50 disabled:pointer-events-none",
  ghostLight:
    "py-3 px-5 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-white/25 text-white hover:bg-white/10 focus:outline-hidden focus:bg-white/10",
};

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-1 text-sm" aria-label="Sayfa yolu">
      <li className="inline-flex items-center">
        <Link className="text-muted-foreground-1 hover:text-primary focus:outline-hidden focus:text-primary" href="/">Ana sayfa</Link>
        <ChevronRight className="mx-1.5 size-4 shrink-0 text-muted-foreground" />
      </li>
      {items.map((it, i) => (
        <li key={i} className="inline-flex items-center">
          {it.href ? (
            <Link className="text-muted-foreground-1 hover:text-primary focus:outline-hidden focus:text-primary" href={it.href}>{it.label}</Link>
          ) : (
            <span className="font-medium text-foreground truncate" aria-current="page">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="mx-1.5 size-4 shrink-0 text-muted-foreground" />}
        </li>
      ))}
    </ol>
  );
}

export function PageHero({ eyebrow, title, description, breadcrumbs, children }: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  breadcrumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line-2 bg-surface">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="relative container-page py-10 md:py-14">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-2" : "mt-6"} max-w-3xl text-3xl md:text-5xl font-semibold text-foreground`}>{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground-2">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-3 text-muted-foreground-2">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline focus:outline-hidden">
          {action.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col h-full bg-card border border-card-line rounded-xl overflow-hidden shadow-2xs hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition focus:outline-hidden focus:ring-2 focus:ring-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eef2f7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageFor(product)} alt={product.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <span className="absolute top-3 start-3 inline-flex items-center rounded-md bg-white/90 px-2 py-1 font-mono text-[11px] font-semibold text-[#0B1F3F] shadow-2xs backdrop-blur">
          {product.code}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary line-clamp-2">{product.name.replace(`${product.code} `, "")}</h3>
        {product.summary && <p className="mt-1.5 text-sm text-muted-foreground-1 line-clamp-2">{product.summary}</p>}
        <span className="mt-auto pt-4 inline-flex items-center gap-x-1 text-sm font-semibold text-primary">
          İncele <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductCardType[] }) {
  if (!products.length) {
    return <p className="rounded-xl border border-dashed border-line-3 p-10 text-center text-muted-foreground-1">Bu kategoride henüz ürün bulunmuyor.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
