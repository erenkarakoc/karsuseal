import Link from "next/link";
import { ArrowRight, CircleCheck, Compass, Disc, MapPin, Package, Ruler, Wrench } from "lucide-react";
import { btn, CtaBand, ProductGrid, SectionHeading } from "@/components/site/ui";
import { IndustryIcon } from "@/components/site/industry-icon";
import { getCategoryTree, getFeaturedProducts } from "@/lib/catalog";
import { imageFor } from "@/lib/images";
import { industries, services } from "@/data/site";

const SERVICE_ICONS = { wrench: Wrench, disc: Disc, ruler: Ruler, "map-pin": MapPin, package: Package, compass: Compass } as const;

export default async function HomePage() {
  const [tree, featured] = await Promise.all([getCategoryTree(), getFeaturedProducts(8)]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" aria-hidden />
        <div className="relative container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-x-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-200">
              <span className="size-1.5 rounded-full bg-primary" /> Mekanik sızdırmazlık çözümleri
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Sızdırmazlıkta <span className="text-primary">doğru parça</span>, doğru zamanda.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground-2">
              Pompa, mikser ve döner ekipmanlarınız için mekanik salmastra, kartuş salmastra, döner başlık ve sızdırmazlık ürünleri. Seçimden revizyona kadar teknik destek.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/urunler" className={btn.primary}>Ürün kataloğu <ArrowRight className="size-4" /></Link>
              <Link href="/teklif-al" className={btn.secondary}>Teklif iste</Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground-2 sm:grid-cols-2">
              {["EN 12756 ölçülerinde standart tipler", "Muadil ve OEM uyumlu salmastralar", "Revizyon ve lepleme hizmeti", "Akışkana göre malzeme seçimi"].map((t) => (
                <li key={t} className="flex items-center gap-x-2"><CircleCheck className="size-4 shrink-0 text-primary" />{t}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl">
              <div className="overflow-hidden rounded-2xl border border-card-line bg-card shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/illustrations/seal-cartridge.svg" alt="Tek kartuş mekanik salmastra" className="w-full" />
              </div>
              <div className="absolute -bottom-6 -start-4 w-40 overflow-hidden rounded-xl border border-card-line bg-card shadow-lg sm:w-48 md:-start-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/illustrations/seal-multispring.svg" alt="Çok yaylı mekanik salmastra" className="w-full" />
              </div>
              <div className="absolute -top-5 -end-3 w-36 overflow-hidden rounded-xl border border-card-line bg-card shadow-lg sm:w-44 md:-end-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/illustrations/rotary-joint.svg" alt="Döner başlık" className="w-full" />
              </div>
              <div className="absolute bottom-6 end-4 hidden rounded-xl border border-card-line bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:block">
                <p className="font-mono text-[11px] font-semibold text-primary">KS-CS · Tek kartuş</p>
                <p className="mt-1 text-xs text-muted-foreground-2">d1 25–100 mm · ≤ 25 bar · −40…+220 °C</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Ürün grupları" title="Tüm sızdırmazlık ihtiyaçlarınız tek tedarikçide" description="Standart tiplerden özel imalata kadar, akışkana ve çalışma koşullarına uygun ürünler." action={{ href: "/urunler", label: "Tüm kategoriler" }} />
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

      {/* Featured */}
      <section className="border-y border-line-2 bg-surface py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Öne çıkanlar" title="En çok talep gören ürünler" action={{ href: "/urunler/mekanik-salmastralar", label: "Mekanik salmastralar" }} />
          <div className="mt-10">
            <ProductGrid products={featured} />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Sektörler" title="Her prosesin kendi sızdırmazlık sorunu var" description="Sektörünüzün akışkanlarını, standartlarını ve bakım döngülerini biliyoruz." action={{ href: "/sektorler", label: "Tüm sektörler" }} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((ind) => (
            <Link key={ind.slug} href={`/sektorler/${ind.slug}`} className="group rounded-xl border border-card-line bg-card p-5 hover:border-primary-300 hover:bg-primary-50/40 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 transition focus:outline-hidden focus:ring-2 focus:ring-primary">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                <IndustryIcon slug={ind.slug} className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-[15px] font-semibold text-foreground group-hover:text-primary">{ind.name}</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground-1 line-clamp-3">{ind.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Services + process */}
      <section className="bg-primary-950 text-white">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">Hizmetler</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-semibold">Ürünün ötesinde: seçim, revizyon ve saha desteği</h2>
              <p className="mt-4 text-white/70">Salmastra ömrünü uzatmak, arızayı kökünden çözmek ve duruş süresini kısaltmak için yanınızdayız.</p>
              <Link href="/hizmetler" className={`${btn.ghostLight} mt-8`}>Hizmetlerimiz <ArrowRight className="size-4" /></Link>
            </div>
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              {services.map((s) => {
                const Icon = SERVICE_ICONS[s.icon as keyof typeof SERVICE_ICONS] ?? Wrench;
                return (
                  <div key={s.slug} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className="size-6 text-primary-300" />
                    <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-white/65">{s.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 grid gap-6 border-t border-white/10 pt-12 md:grid-cols-4">
            {[
              ["01", "Bilgileri paylaşın", "Pompa modeli, akışkan, basınç, sıcaklık ve mil çapı."],
              ["02", "Doğru tipi seçelim", "Çalışma koşullarına uygun tip ve malzeme kombinasyonu."],
              ["03", "Teklif ve tedarik", "Stoktan hızlı sevk veya ölçüye özel imalat."],
              ["04", "Montaj ve destek", "Devreye alma, arıza analizi ve revizyon."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <p className="font-display text-3xl font-semibold text-primary-300">{n}</p>
                <h3 className="mt-2 font-display font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-white/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
