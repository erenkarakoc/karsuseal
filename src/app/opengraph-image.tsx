import { ogCard, OG_SIZE } from "@/lib/og/card";

export const alt = "Karsu Seal — Mekanik Sızdırmazlık Çözümleri";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Mekanik sızdırmazlık çözümleri",
    title: "Sızdırmazlıkta doğru parça, doğru zamanda.",
    subtitle: "Mekanik salmastralar, kartuş ve mikser salmastraları, döner başlıklar, örgü salmastralar, O-ringler ve conta ürünleri.",
  });
}
