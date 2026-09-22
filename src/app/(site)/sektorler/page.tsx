import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndustryIcon } from "@/components/site/industry-icon";
import { CtaBand, PageHero } from "@/components/site/ui";
import { industries } from "@/data/site";

export const metadata: Metadata = { title: "Sektörler", description: "Karsu Seal sızdırmazlık çözümlerinin kullanıldığı sektörler." };

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Sektörler" title="Sektörünüze göre sızdırmazlık" description="Her sektörün akışkanı, standardı ve bakım döngüsü farklıdır. Uygulamanıza uygun ürün gruplarını keşfedin." breadcrumbs={[{ label: "Sektörler" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Link key={i.slug} href={`/sektorler/${i.slug}`} className="group flex flex-col rounded-xl border border-card-line bg-card p-6 hover:border-primary-300 hover:shadow-md transition">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                <IndustryIcon slug={i.slug} className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-foreground group-hover:text-primary">{i.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground-2">{i.summary}</p>
              <span className="mt-auto pt-5 inline-flex items-center gap-x-1 text-sm font-semibold text-primary">Çözümleri gör <ArrowRight className="size-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
