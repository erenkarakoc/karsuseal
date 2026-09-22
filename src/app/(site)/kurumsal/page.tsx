import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentIcon } from "@/components/site/content-icon";
import { CtaBand } from "@/components/site/cta-band";
import { RichText } from "@/components/site/rich-text";
import { PageHero, btn } from "@/components/site/ui";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Kurumsal", description: "Karsu Seal hakkında: mekanik sızdırmazlık alanında ürün, tedarik ve teknik hizmet." };

export default async function AboutPage() {
  const c = await getContent("kurumsal");
  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} breadcrumbs={[{ label: "Kurumsal" }]} />
      <section className="container-page py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RichText text={c.body} className="text-lg" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {c.primary.label && <Link href={c.primary.href} className={btn.primary}>{c.primary.label} <ArrowRight className="size-4" /></Link>}
              {c.secondary.label && <Link href={c.secondary.href} className={btn.secondary}>{c.secondary.label}</Link>}
            </div>
          </div>
          {c.values.length > 0 && (
            <div className="lg:col-span-5">
              <div className="grid gap-4">
                {c.values.map((v) => (
                  <div key={v.title} className="flex gap-x-4 rounded-xl border border-card-line bg-card p-5">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300"><ContentIcon name={v.icon} className="size-5" /></span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-foreground">{v.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground-2">{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
