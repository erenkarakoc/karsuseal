import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { ContentIcon } from "@/components/site/content-icon";
import { QuoteForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/ui";
import { getProductBySlug, getPublicSettings } from "@/lib/catalog";
import { imageFor } from "@/lib/images";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fiyat Teklifi Al",
  description: "Teklif listenizdeki ürünler ve çalışma koşullarınız için Karsu Seal'den teknik fiyat teklifi isteyin.",
};

type Props = { searchParams: Promise<{ urun?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const { urun } = await searchParams;
  const [product, settings, content] = await Promise.all([urun ? getProductBySlug(urun) : null, getPublicSettings(), getContent("teklif-al")]);
  const initialItem = product
    ? { product_id: product.id, slug: product.slug, code: product.code, name: product.name, image: imageFor(product) }
    : undefined;
  const tel = settings.company_phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero eyebrow={content.intro.eyebrow} title={content.intro.title} description={content.intro.description} breadcrumbs={[{ label: "Teklif al" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-card-line bg-card p-5 sm:p-8">
              <QuoteForm initialItem={initialItem} />
            </div>
          </div>
          <aside className="lg:col-span-4 space-y-4">
            {content.cards.map(({ icon, title, text }) => (
              <div key={title} className="rounded-xl border border-card-line bg-card p-5">
                <ContentIcon name={icon} className="size-6 text-primary" />
                <h3 className="mt-3 font-display font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground-2">{text}</p>
              </div>
            ))}
            {settings.company_phone && (
              <a href={`tel:${tel}`} className="flex items-center gap-x-4 rounded-xl bg-primary-950 p-5 text-white hover:bg-primary-900">
                <Phone className="size-6 text-primary-300" />
                <span>
                  <span className="block text-xs text-white/60">Acil ihtiyaçlar için</span>
                  <span className="font-display text-lg font-semibold">{settings.company_phone}</span>
                </span>
              </a>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
