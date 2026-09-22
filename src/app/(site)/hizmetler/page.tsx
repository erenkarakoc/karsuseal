import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { ContentIcon } from "@/components/site/content-icon";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/ui";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { intro } = await getContent("hizmetler");
  return { title: "Hizmetler", description: intro.description };
}

export default async function ServicesPage() {
  const { intro, items } = await getContent("hizmetler");
  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} breadcrumbs={[{ label: "Hizmetler" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((s) => (
            <article key={s.slug} id={s.slug} className="scroll-mt-32 rounded-2xl border border-card-line bg-card p-6 md:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                <ContentIcon name={s.icon} className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-muted-foreground-2">{s.summary}</p>
              {s.details.length > 0 && (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-x-2 text-sm text-foreground"><CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />{d}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
