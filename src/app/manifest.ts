import type { MetadataRoute } from "next";

// Installable web app: required for push notifications on iPhone/iPad
// ("Ana Ekrana Ekle", iOS 16.4+) and gives the admin panel an app icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karsu Seal — Mekanik Sızdırmazlık Çözümleri",
    short_name: "Karsu Seal",
    description: "Mekanik salmastralar, döner başlıklar ve sızdırmazlık ürünleri.",
    lang: "tr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1D5FD1",
    icons: [
      { src: "/brand/png/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/png/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/png/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Yönetim paneli", url: "/admin", icons: [{ src: "/brand/png/icon-192.png", sizes: "192x192" }] },
      { name: "Teklif al", url: "/teklif-al" },
    ],
  };
}
