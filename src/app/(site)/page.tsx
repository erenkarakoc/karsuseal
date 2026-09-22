import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { btn, ProductGrid, SectionHeading } from "@/components/site/ui";
import { CtaBand } from "@/components/site/cta-band";
import { ContentIcon } from "@/components/site/content-icon";
import { getCategoryTree, getFeaturedProducts } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import type { HomeContent, HomeSection } from "@/lib/content/defaults";
import { imageFor } from "@/lib/images";

export default async function HomePage() {
  const [home, industries, services, tree] = await Promise.all([getContent("ana-sayfa"), getContent("sektorler"), getContent("hizmetler"), getCategoryTree()]);
  const featured = await getFeaturedProducts(home.featured.limit);
  const visible = home.order.filter((s) => !home.hidden.includes(s));

  const sections: Record<HomeSection, (prev?: HomeSection) => React.ReactNode> = {
    categories: () => (
      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow={home.categories.eyebrow} title={home.categories.title} description={home.categories.description} action={home.categories.linkLabel ? { href: "/urunler", label: home.categories.linkLabel } : undefined} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {tree.map((c, i) => (
            <Link
              key={c.id}
              href={`/urunler/${c.slug}`}
              className={`group relative flex flex-col overflow-hidden rounded-xl border border-card-line bg-card hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700 transition focus:outline-hidden focus:ring-2 focus:ring-primary ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
            >
              <div className={`overflow-hidden bg-[#eef2f7] ${i === 0 ? "aspect-[4/3] sm:aspect-auto sm:flex-1" : "aspect-[4/3]"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageFor(c)} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="p-4 md:p-5">
                <h3 className={`font-display font-semibold text-foreground group-hover:text-primary ${i === 0 ? "text-xl md:text-2xl" : "text-base"}`}>{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground-1 line-clamp-2">{c.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    ),

    featured: () =>
      featured.length > 0 && (
        <section className="border-y border-line-2 bg-surface py-16 md:py-24">
          <div className="container-page">
            <SectionHeading eyebrow={home.featured.eyebrow} title={home.featured.title} action={home.featured.link.label ? { href: home.featured.link.href, label: home.featured.link.label } : undefined} />
            <div className="mt-10"><ProductGrid products={featured} /></div>
          </div>
        </section>
      ),

    industries: () => (
      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow={home.industries.eyebrow} title={home.industries.title} description={home.industries.description} action={home.industries.linkLabel ? { href: "/sektorler", label: home.industries.linkLabel } : undefined} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {industries.items.map((ind) => (
            <Link key={ind.slug} href={`/sektorler/${ind.slug}`} className="group rounded-xl border border-card-line bg-card p-5 hover:border-primary-300 hover:bg-primary-50/40 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 transition focus:outline-hidden focus:ring-2 focus:ring-primary">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                <ContentIcon name={ind.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-[15px] font-semibold text-foreground group-hover:text-primary">{ind.name}</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground-1 line-clamp-3">{ind.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    ),

    services: () => (
      <section className="bg-primary-950 text-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{home.services.eyebrow}</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-semibold">{home.services.title}</h2>
              <p className="mt-4 text-white/70">{home.services.description}</p>
              {home.services.buttonLabel && <Link href="/hizmetler" className={`${btn.ghostLight} mt-8`}>{home.services.buttonLabel} <ArrowRight className="size-4" /></Link>}
            </div>
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              {services.items.map((s) => (
                <div key={s.slug} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <ContentIcon name={s.icon} className="size-6 text-primary-300" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-white/65">{s.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),

    // Visually joins the services band when it directly follows it.
    process: (prev) =>
      home.process.steps.length > 0 && (
        <section className="bg-primary-950 text-white">
          <div className={`container-page ${prev === "services" ? "-mt-4 pb-16 md:-mt-8 md:pb-24" : "py-16 md:py-20"}`}>
            <div className={`grid gap-6 md:grid-cols-4 ${prev === "services" ? "border-t border-white/10 pt-12" : ""}`}>
              {home.process.steps.map((st, i) => (
                <div key={i}>
                  <p className="font-display text-3xl font-semibold text-primary-300">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display font-semibold">{st.title}</h3>
                  <p className="mt-1 text-sm text-white/65">{st.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

    cta: () => <CtaBand />,
  };

  return (
    <>
      <Hero hero={home.hero} />
      {visible.map((key, i) => (
        <Fragment key={key}>{sections[key](visible[i - 1])}</Fragment>
      ))}
    </>
  );
}

function Hero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" aria-hidden />
      <div className="relative container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          {hero.badge && (
            <p className="inline-flex items-center gap-x-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-200">
              <span className="size-1.5 rounded-full bg-primary" /> {hero.badge}
            </p>
          )}
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            {hero.titleStart} {hero.titleHighlight && <span className="text-primary">{hero.titleHighlight}</span>}
            {hero.titleEnd}
          </h1>
          {hero.description && <p className="mt-5 max-w-xl text-lg text-muted-foreground-2">{hero.description}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {hero.primary.label && <Link href={hero.primary.href} className={btn.primary}>{hero.primary.label} <ArrowRight className="size-4" /></Link>}
            {hero.secondary.label && <Link href={hero.secondary.href} className={btn.secondary}>{hero.secondary.label}</Link>}
          </div>
          {hero.bullets.length > 0 && (
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground-2 sm:grid-cols-2">
              {hero.bullets.map((t) => (
                <li key={t} className="flex items-center gap-x-2"><CircleCheck className="size-4 shrink-0 text-primary" />{t}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-xl">
            {hero.mainImage && (
              <div className="overflow-hidden rounded-2xl border border-card-line bg-card shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.mainImage} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
            {hero.sideImage1 && (
              <div className="absolute -bottom-6 -start-4 w-40 overflow-hidden rounded-xl border border-card-line bg-card shadow-lg sm:w-48 md:-start-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.sideImage1} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
            {hero.sideImage2 && (
              <div className="absolute -top-5 -end-3 w-36 overflow-hidden rounded-xl border border-card-line bg-card shadow-lg sm:w-44 md:-end-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.sideImage2} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
            {hero.specTitle && (
              <div className="absolute bottom-6 end-4 hidden rounded-xl border border-card-line bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:block">
                <p className="font-mono text-[11px] font-semibold text-primary">{hero.specTitle}</p>
                {hero.specText && <p className="mt-1 text-xs text-muted-foreground-2">{hero.specText}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
