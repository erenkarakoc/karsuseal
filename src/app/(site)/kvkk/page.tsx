import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { getPublicSettings } from "@/lib/catalog";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni", robots: { index: false } };

// NOT: Bu metin genel bir şablondur. Yayına almadan önce şirket unvanı, adres ve
// saklama süreleri gibi bilgileri bir hukuk danışmanıyla birlikte güncelleyin.
export default async function KvkkPage() {
  const s = await getPublicSettings();
  return (
    <>
      <PageHero title="Kişisel Verilerin Korunması Aydınlatma Metni" breadcrumbs={[{ label: "KVKK" }]} />
      <section className="container-page py-10 md:py-14">
        <div className="prose-karsu max-w-3xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, veri sorumlusu sıfatıyla Karsu Seal tarafından internet sitemizdeki iletişim ve teklif formları aracılığıyla elde edilen kişisel verilerin işlenmesine ilişkin olarak hazırlanmıştır.
          </p>
          <h2>İşlenen kişisel veriler</h2>
          <p>Ad soyad, firma adı, e-posta adresi, telefon numarası, şehir ve form üzerinden ilettiğiniz mesaj ile teknik bilgiler.</p>
          <h2>İşleme amaçları</h2>
          <p>Talebinizin değerlendirilmesi ve yanıtlanması, fiyat teklifi hazırlanması, satış öncesi ve sonrası iletişimin yürütülmesi.</p>
          <h2>Hukuki sebep ve toplama yöntemi</h2>
          <p>Kişisel verileriniz, internet sitemizdeki formlar aracılığıyla elektronik ortamda; KVKK m. 5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması) ve m. 5/2-f (meşru menfaat) hukuki sebeplerine dayanılarak toplanmaktadır.</p>
          <h2>Aktarım</h2>
          <p>Verileriniz; barındırma, veritabanı ve e-posta bildirim hizmeti aldığımız tedarikçilerle, yalnızca hizmetin sunulması amacıyla ve gerekli güvenlik önlemleri alınarak paylaşılabilir. Bu hizmet sağlayıcıların sunucuları yurt dışında bulunabilir.</p>
          <h2>Haklarınız</h2>
          <p>KVKK m. 11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme ve itiraz etme haklarına sahipsiniz. Başvurularınızı {s.company_email ?? "e-posta adresimize"} üzerinden iletebilirsiniz.</p>
        </div>
      </section>
    </>
  );
}
