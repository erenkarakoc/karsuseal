import type { Metadata } from "next";
import { CircleCheck, Compass, Disc, MapPin, Package, Ruler, Wrench } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/ui";
import { services } from "@/data/site";

export const metadata: Metadata = { title: "Hizmetler", description: "Mekanik salmastra revizyonu, lepleme, ölçüye özel imalat, saha desteği ve ürün seçimi hizmetleri." };

const ICONS = { wrench: Wrench, disc: Disc, ruler: Ruler, "map-pin": MapPin, package: Package, compass: Compass } as const;

const DETAILS: Record<string, string[]> = {
  "salmastra-revizyonu": ["Sökme, temizlik ve hasar analizi", "Yüzeylerin lepleme ile yenilenmesi veya değişimi", "O-ring, yay ve sekonder conta yenileme", "Basınç / sızdırmazlık testi ve raporlama"],
  "lepleme-hizmeti": ["Karbon, SiC, TC ve seramik yüzeyler", "Monokromatik ışık ve optik düzlem ile kontrol", "Ø 10 – 250 mm aralığında parçalar", "Hızlı iş akışı ile kısa teslim"],
  "olcuye-ozel-imalat": ["Numuneden ölçü alma ve teknik çizim", "Muadil salmastra ve yedek parça imalatı", "Özel malzeme kombinasyonları", "Küçük seri ve tekil üretim"],
  "yerinde-servis": ["Montaj ve devreye alma", "Titreşim, hizalama ve mil salgısı kontrolü", "Arıza kök neden analizi", "Bakım personeline uygulamalı eğitim"],
  "stok-tedarik": ["Standart tipler ve yaygın ölçüler stokta", "O-ring ve örgü salmastra stoğu", "Planlı bakımlar için yedek parça setleri", "Türkiye geneli hızlı sevkiyat"],
  "urun-secimi": ["Akışkan, basınç, sıcaklık ve devir analizi", "Malzeme uyumluluk değerlendirmesi", "API 682 destek sistemi seçimi", "Toplam sahip olma maliyeti karşılaştırması"],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Hizmetler" title="Seçimden revizyona teknik destek" description="Salmastra ömrünü uzatmak, arızaları kökünden çözmek ve duruş süresini kısaltmak için ürünün ötesinde hizmet veriyoruz." breadcrumbs={[{ label: "Hizmetler" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Wrench;
            return (
              <article key={s.slug} id={s.slug} className="scroll-mt-32 rounded-2xl border border-card-line bg-card p-6 md:p-8">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-foreground">{s.title}</h2>
                <p className="mt-2 text-muted-foreground-2">{s.summary}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {(DETAILS[s.slug] ?? []).map((d) => (
                    <li key={d} className="flex gap-x-2 text-sm text-foreground"><CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />{d}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
