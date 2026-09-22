import type { Metadata } from "next";
import { Clock, FileSearch, Phone } from "lucide-react";
import { QuoteForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/ui";
import { getProductBySlug, getPublicSettings } from "@/lib/catalog";
import { imageFor } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fiyat Teklifi Al",
  description: "Teklif listenizdeki ürünler ve çalışma koşullarınız için Karsu Seal'den teknik fiyat teklifi isteyin.",
};

type Props = { searchParams: Promise<{ urun?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const { urun } = await searchParams;
  const [product, settings] = await Promise.all([urun ? getProductBySlug(urun) : null, getPublicSettings()]);
  const initialItem = product
    ? { product_id: product.id, slug: product.slug, code: product.code, name: product.name, image: imageFor(product) }
    : undefined;
  const tel = settings.company_phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero
        eyebrow="Teklif"
        title="Fiyat teklifi alın"
        description="Listenizdeki ürünleri ve bildiğiniz çalışma koşullarını paylaşın; uygun tipi ve malzemeyi belirleyip size teklif gönderelim."
        breadcrumbs={[{ label: "Teklif al" }]}
      />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-card-line bg-card p-5 sm:p-8">
              <QuoteForm initialItem={initialItem} />
            </div>
          </div>
          <aside className="lg:col-span-4 space-y-4">
            {[
              { icon: FileSearch, title: "Ölçüyü bilmiyor musunuz?", text: "Pompa etiketindeki bilgileri veya eski salmastranın ölçülerini mesajınıza yazın; gerekirse fotoğraf için size e-posta ile dönelim." },
              { icon: Clock, title: "Hızlı dönüş", text: "Stoktaki ürünler için aynı iş günü, özel imalatlar için termin bilgisiyle birlikte teklif hazırlanır." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-card-line bg-card p-5">
                <Icon className="size-6 text-primary" />
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
