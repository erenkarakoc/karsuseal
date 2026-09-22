import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, Microscope, ShieldCheck, Timer } from "lucide-react";
import { CtaBand, PageHero, btn } from "@/components/site/ui";

export const metadata: Metadata = { title: "Kurumsal", description: "Karsu Seal hakkında: mekanik sızdırmazlık alanında ürün, tedarik ve teknik hizmet." };

const VALUES = [
  { icon: Microscope, title: "Mühendislik odaklı seçim", text: "Her talebi akışkan, basınç, sıcaklık ve devir bilgisiyle değerlendirir; ürünü değil çözümü öneririz." },
  { icon: Timer, title: "Duruş süresine saygı", text: "Stok, hızlı teklif ve revizyon hizmetiyle tesislerinizin çalışmaya devam etmesini önceliklendiririz." },
  { icon: ShieldCheck, title: "İzlenebilir kalite", text: "Malzeme kombinasyonlarını, çalışma limitlerini ve test sonuçlarını şeffaf biçimde paylaşırız." },
  { icon: Handshake, title: "Uzun vadeli iş birliği", text: "Tekrarlayan arızaların kök nedenini birlikte bularak bakım maliyetini düşürmeyi hedefleriz." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Kurumsal" title="Sızdırmazlığı bir parça değil, bir süreç olarak görüyoruz" breadcrumbs={[{ label: "Kurumsal" }]} />
      <section className="container-page py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 prose-karsu text-lg">
            <p>
              Karsu Seal; pompa, mikser, karıştırıcı ve döner ekipmanlar için mekanik salmastra, kartuş salmastra, döner başlık ve tamamlayıcı sızdırmazlık ürünleri sunar. Standart EN 12756 tiplerinden OEM uyumlu muadillere, örgü salmastradan O-ring ve conta ürünlerine kadar geniş bir yelpazede tek noktadan tedarik sağlar.
            </p>
            <p>
              Amacımız yalnızca doğru parçayı teslim etmek değil; salmastranın neden arızalandığını anlamak, çalışma koşullarına en uygun tip ve malzemeyi seçmek ve ekipmanlarınızın bir sonraki bakıma kadar sorunsuz çalışmasını sağlamaktır. Revizyon, lepleme ve ölçüye özel imalat hizmetlerimiz bu yaklaşımın parçasıdır.
            </p>
            <p>
              Su ve atık sudan kimyaya, gıdadan enerjiye kadar farklı sektörlerdeki müşterilerimize hızlı teklif, teknik danışmanlık ve saha desteğiyle hizmet veriyoruz.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/urunler" className={btn.primary}>Ürün kataloğu <ArrowRight className="size-4" /></Link>
              <Link href="/iletisim" className={btn.secondary}>İletişime geçin</Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid gap-4">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-x-4 rounded-xl border border-card-line bg-card p-5">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300"><Icon className="size-5" /></span>
                  <div>
                    <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground-2">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
