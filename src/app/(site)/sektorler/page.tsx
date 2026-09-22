import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentIcon } from "@/components/site/content-icon";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/ui";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { intro } = await getContent("sektorler");
  return { title: intro.title, description: intro.description };
}

export default async function IndustriesPage() {
  const { intro, items } = await getContent("sektorler");
  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} breadcrumbs={[{ label: "Sektörler" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Link key={i.slug} href={`/sektorler/${i.slug}`} className="group flex flex-col rounded-xl border border-card-line bg-card p-6 hover:border-primary-300 hover:shadow-md transition">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                <ContentIcon name={i.icon} className="size-6" />
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
