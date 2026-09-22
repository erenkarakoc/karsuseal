import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/forms";
import { PageHero } from "@/components/site/ui";
import { getPublicSettings } from "@/lib/catalog";

export const metadata: Metadata = { title: "İletişim", description: "Karsu Seal iletişim bilgileri ve iletişim formu." };

export default async function ContactPage() {
  const s = await getPublicSettings();
  const tel = s.company_phone?.replace(/[^\d+]/g, "");
  const wa = s.company_whatsapp?.replace(/[^\d]/g, "");
  const cards = [
    s.company_phone && { icon: Phone, label: "Telefon", value: s.company_phone, href: `tel:${tel}` },
    wa && { icon: MessageCircle, label: "WhatsApp", value: s.company_whatsapp!, href: `https://wa.me/${wa}` },
    s.company_email && { icon: Mail, label: "E-posta", value: s.company_email, href: `mailto:${s.company_email}` },
    s.company_address && { icon: MapPin, label: "Adres", value: s.company_address, href: s.company_maps_url ?? undefined },
    s.working_hours && { icon: Clock, label: "Çalışma saatleri", value: s.working_hours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Size nasıl yardımcı olabiliriz?"
        description="Ürün seçimi, teknik destek veya sipariş için bize yazın; mesai saatleri içinde dönüş yapıyoruz."
        breadcrumbs={[{ label: "İletişim" }]}
      />
      <section className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-3">
            {cards.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950 dark:text-primary-300">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium text-muted-foreground-1">{label}</span>
                    <span className="block font-semibold text-foreground">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-x-4 rounded-xl border border-card-line bg-card p-4 hover:border-primary-300">
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-x-4 rounded-xl border border-card-line bg-card p-4">{inner}</div>
              );
            })}
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-card-line bg-card p-5 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground">Mesaj gönderin</h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground-1">
                Fiyat teklifi için <Link href="/teklif-al" className="font-medium text-primary hover:underline">teklif formunu</Link> kullanmanız daha hızlı sonuç verir.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
