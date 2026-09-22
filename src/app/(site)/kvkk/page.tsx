import type { Metadata } from "next";
import { RichText } from "@/components/site/rich-text";
import { PageHero } from "@/components/site/ui";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni", robots: { index: false } };

// Metin panelden düzenlenir (İçerik → KVKK). Varsayılan metin genel bir şablondur;
// yayına almadan önce bir hukuk danışmanıyla birlikte güncelleyin.
export default async function KvkkPage() {
  const c = await getContent("kvkk");
  return (
    <>
      <PageHero title={c.title} breadcrumbs={[{ label: "KVKK" }]} />
      <section className="container-page py-10 md:py-14">
        <RichText text={c.body} className="max-w-3xl" />
      </section>
    </>
  );
}
