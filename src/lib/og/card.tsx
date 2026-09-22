import { ImageResponse } from "next/og";
import { DROP_PATH, RING_PATH, WORDMARK } from "@/components/brand/logo-paths";
import { BRICOLAGE_500, BRICOLAGE_500_EXT, BRICOLAGE_700, BRICOLAGE_700_EXT } from "./fonts";

// Shared 1200×630 social preview card (WhatsApp, LinkedIn, Facebook, X need PNG/JPG, not SVG).
export const OG_SIZE = { width: 1200, height: 630 };

const buf = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
const FONTS = [
  { name: "Bricolage", data: buf(BRICOLAGE_700), weight: 700 as const, style: "normal" as const },
  { name: "Bricolage", data: buf(BRICOLAGE_700_EXT), weight: 700 as const, style: "normal" as const },
  { name: "Bricolage", data: buf(BRICOLAGE_500), weight: 500 as const, style: "normal" as const },
  { name: "Bricolage", data: buf(BRICOLAGE_500_EXT), weight: 500 as const, style: "normal" as const },
];

const NAVY = "#0B1F3F";
const BLUE = "#1D5FD1";

function Logo() {
  const h = 56;
  const scale = h / 48;
  const w = (59 + WORDMARK.width) * scale;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${59 + WORDMARK.width} 48`}>
      <path fill="#ffffff" fillRule="evenodd" d={RING_PATH} />
      <path fill="#5B97F7" d={DROP_PATH} />
      <g transform={`translate(59 ${24 - WORDMARK.height / 2})`}>
        <path fill="#ffffff" d={WORDMARK.karsu} />
        <path fill="#5B97F7" d={WORDMARK.seal} />
      </g>
    </svg>
  );
}

export function ogCard({ eyebrow, title, subtitle, specs = [], badge }: {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  specs?: { label: string; value: string }[];
  badge?: string;
}) {
  const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  // Bricolage has no ≤/≥ glyphs; spell them out so the card never shows missing-glyph boxes.
  const glyphs = (s: string) => s.replace(/≤\s*/g, "maks. ").replace(/≥\s*/g, "min. ");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", background: NAVY, color: "#fff", fontFamily: "Bricolage", position: "relative" }}>
        {/* decorative rings */}
        <div style={{ position: "absolute", right: -140, top: -140, width: 520, height: 520, borderRadius: 9999, border: "56px solid rgba(91,151,247,0.16)", display: "flex" }} />
        <div style={{ position: "absolute", right: 60, top: 60, width: 200, height: 200, borderRadius: 9999, border: "20px solid rgba(255,255,255,0.06)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          {badge && (
            <div style={{ display: "flex", padding: "8px 18px", borderRadius: 10, background: BLUE, fontSize: 28, fontWeight: 700 }}>{badge}</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#8DB6FA", letterSpacing: 2 }}>{clamp(eyebrow, 60).toLocaleUpperCase("tr")}</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: title.length > 40 ? 58 : 70, fontWeight: 700, lineHeight: 1.05 }}>{clamp(title, 80)}</div>
          {subtitle && <div style={{ display: "flex", marginTop: 18, fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.72)", lineHeight: 1.3 }}>{clamp(subtitle, 140)}</div>}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {specs.slice(0, 4).map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", padding: "14px 20px", borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", maxWidth: 270 }}>
              <div style={{ display: "flex", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{clamp(s.label, 24)}</div>
              <div style={{ display: "flex", marginTop: 4, fontSize: 24, fontWeight: 700 }}>{clamp(glyphs(s.value), 22)}</div>
            </div>
          ))}
          {!specs.length && <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.72)" }}>karsuseal.com</div>}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS },
  );
}
