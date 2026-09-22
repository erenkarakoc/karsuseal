import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import PrelineScript from "@/components/preline-script";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

// Catalog content is edited from the admin panel, so every page renders at request time.
export const dynamic = "force-dynamic";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin", "latin-ext"], display: "swap" });
const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Karsu Seal — Mekanik Sızdırmazlık Çözümleri", template: "%s · Karsu Seal" },
  description:
    "Mekanik salmastralar, kartuş ve mikser salmastraları, döner başlıklar, yumuşak salmastralar, O-ringler ve conta ürünleri. Teknik destek ve hızlı teklif.",
  applicationName: "Karsu Seal",
  openGraph: { type: "website", locale: "tr_TR", siteName: "Karsu Seal", images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Karsu Seal" }] },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: "Karsu Seal", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f3f" },
  ],
};

// Applies the saved theme before first paint (Preline stores it as `hs_theme`).
const themeScript = `try{var t=localStorage.getItem("hs_theme");var d=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);var h=document.documentElement;h.classList.add(d?"dark":"light");}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-theme="theme-karsu" suppressHydrationWarning className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <PrelineScript />
      </body>
    </html>
  );
}
