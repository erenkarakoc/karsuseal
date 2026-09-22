import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHero } from "@/components/site/ui";

export const metadata: Metadata = { title: "Marka Kiti", description: "Karsu Seal logo dosyaları, renkler ve tipografi.", robots: { index: false } };

const VARIANTS = [
  { key: "logo-horizontal", title: "Yatay logo", note: "Birincil kullanım" },
  { key: "logo-stacked", title: "Dikey logo", note: "Kare ve dar alanlar" },
  { key: "logo-tagline", title: "Sloganlı logo", note: "Kurumsal evrak, sunum" },
  { key: "icon", title: "Logo ikonu", note: "Favicon, profil görseli" },
  { key: "wordmark", title: "Yazı logo", note: "İkonun kullanılamadığı yerler" },
];
const SCHEMES = [
  { key: "light", label: "Açık zemin", bg: "bg-white" },
  { key: "dark", label: "Koyu zemin", bg: "bg-[#0B1F3F]" },
  { key: "mono-black", label: "Tek renk siyah", bg: "bg-white" },
  { key: "mono-white", label: "Tek renk beyaz", bg: "bg-[#1D5FD1]" },
];
const COLORS = [
  { name: "Karsu Lacivert", hex: "#0B1F3F", rgb: "11 31 63", use: "Ana marka rengi, ikon karesi ve yazı" },
  { name: "Karsu Mavi", hex: "#1D5FD1", rgb: "29 95 209", use: "Seal yazısı, vurgu ve butonlar; koyu zeminde ikon karesi" },
  { name: "Koyu Zemin Mavisi", hex: "#5B97F7", rgb: "91 151 247", use: "İkonun iç yüzeyi, koyu zeminde vurgu" },
  { name: "Beyaz", hex: "#FFFFFF", rgb: "255 255 255", use: "Zemin ve koyu zeminde logo" },
];

export default function BrandPage() {
  return (
    <>
      <PageHero eyebrow="Marka kiti" title="Karsu Seal kimliği" description="Logo dosyaları, renk kodları ve kullanım kuralları. Tüm dosyalar vektör (SVG) formatındadır ve yazılar eğriye çevrilmiştir." breadcrumbs={[{ label: "Marka kiti" }]} />

      <section className="container-page py-10 md:py-14 space-y-14">
        {VARIANTS.map((v) => (
          <div key={v.key}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-semibold text-foreground">{v.title}</h2>
              <p className="text-sm text-muted-foreground-1">{v.note}</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SCHEMES.map((s) => {
                const file = `/brand/karsu-seal-${v.key}-${s.key}.svg`;
                return (
                  <div key={s.key} className="overflow-hidden rounded-xl border border-card-line bg-card">
                    <div className={`flex h-40 items-center justify-center p-8 ${s.bg}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file} alt={`${v.title} — ${s.label}`} className="max-h-full max-w-full" />
                    </div>
                    <div className="flex items-center justify-between border-t border-card-line px-4 py-3">
                      <span className="text-sm text-muted-foreground-2">{s.label}</span>
                      <a href={file} download className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> SVG</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <h2 className="text-2xl font-semibold text-foreground">Uygulama ikonu ve favicon</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["/brand/karsu-seal-app-icon.svg", "Uygulama ikonu (mavi)"],
              ["/brand/karsu-seal-app-icon-navy.svg", "Uygulama ikonu (lacivert)"],
              ["/brand/karsu-seal-favicon.svg", "Favicon (sistem temasına uyumlu)"],
            ].map(([file, label]) => (
              <div key={file} className="overflow-hidden rounded-xl border border-card-line bg-card">
                <div className="flex h-40 items-center justify-center bg-surface p-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file} alt={label} className="size-24" />
                </div>
                <div className="flex items-center justify-between border-t border-card-line px-4 py-3">
                  <span className="text-sm text-muted-foreground-2">{label}</span>
                  <a href={file} download className="inline-flex items-center gap-x-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> SVG</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Renkler</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {COLORS.map((c) => (
                <div key={c.hex} className="overflow-hidden rounded-xl border border-card-line bg-card">
                  <div className="h-20" style={{ background: c.hex }} />
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground-2">HEX {c.hex} · RGB {c.rgb}</p>
                    <p className="mt-2 text-xs text-muted-foreground-1">{c.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Tipografi</h2>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-card-line bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Başlık ve logo — Bricolage Grotesque</p>
                <p className="mt-2 font-display text-4xl font-semibold text-foreground">Sızdırmazlık Aa Çç Ğğ</p>
              </div>
              <div className="rounded-xl border border-card-line bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Metin — Geist</p>
                <p className="mt-2 text-lg text-foreground">Mekanik salmastralar, döner başlıklar ve conta ürünleri. 0123456789</p>
              </div>
            </div>
            <h2 className="mt-10 text-2xl font-semibold text-foreground">Kullanım kuralları</h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-muted-foreground-2">
              <li>Logonun çevresinde en az ikon yüksekliğinin ¼&apos;ü kadar boşluk bırakın.</li>
              <li>Yatay logo için dijitalde en küçük yükseklik 24 px, baskıda 8 mm&apos;dir; ikon tek başına 16 px&apos;e kadar kullanılabilir.</li>
              <li>Açık zeminlerde renkli, koyu zeminlerde koyu zemin sürümünü; tek renk baskılarda siyah/beyaz sürümü kullanın.</li>
              <li>Logoyu döndürmeyin, oranlarını bozmayın, gölge veya efekt eklemeyin, renklerini değiştirmeyin.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
