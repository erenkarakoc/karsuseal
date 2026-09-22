// Sosyal medya paylaşım görselleri (1200×630 PNG) — derleme öncesi statik üretim.
// next/og (Satori + WASM) Cloudflare Workers'ta güvenilir çalışmadığı için görseller
// çalışma anında değil burada üretilir ve public/og/ altından statik dosya olarak sunulur.
//   npm run og:build   (seed kataloğu değiştiğinde çalıştırın; üretilen dosyalar repoya commit edilir)
//
// Panelden sonradan eklenen ürün/kategoriler site geneli görseli (og/default.png) kullanır;
// yeni görseller için seed verisi güncellenip bu betik yeniden çalıştırılabilir.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { categories, products } from "../src/data/catalog.mjs";
import { DISC_PATH, DROP_PATH, RING_PATH, SQUARE_PATH, WORDMARK } from "../src/components/brand/logo-paths.ts";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public", "og");
const fontDir = path.join(root, "node_modules", "@fontsource", "bricolage-grotesque", "files");
const font = (w, sub) => fs.readFileSync(path.join(fontDir, `bricolage-grotesque-${sub}-${w}-normal.woff`));
// Satori does not fall back between files that share a family name, so the latin-ext subset
// (ş, ğ, İ …) gets its own name and is listed as a CSS fallback.
const fonts = [700, 500].flatMap((w) => [
  { name: "Bricolage", data: font(w, "latin"), weight: w, style: "normal" },
  { name: "BricolageExt", data: font(w, "latin-ext"), weight: w, style: "normal" },
]);

const W = 1200, H = 630, NAVY = "#0B1F3F", BLUE = "#1D5FD1";
const h = (type, props = {}, ...children) => ({ type, props: { ...props, children: children.flat().filter((c) => c !== null && c !== false && c !== undefined) } });
const clamp = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
// Bricolage has no ≤/≥ glyphs
const glyphs = (s) => s.replace(/≤\s*/g, "maks. ").replace(/≥\s*/g, "min. ");
const slugify = (t) => t.toLocaleLowerCase("tr").replace(/[ığüşöç]/g, (c) => ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" })[c]).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function logo() {
  const hgt = 56, w = (59 + WORDMARK.width) * (hgt / 48);
  return h("svg", { width: w, height: hgt, viewBox: `0 0 ${59 + WORDMARK.width} 48` },
    h("path", { fill: BLUE, d: SQUARE_PATH }),
    h("path", { fill: "#ffffff", fillRule: "evenodd", d: RING_PATH }),
    h("path", { fill: NAVY, d: DISC_PATH }),
    h("path", { fill: "#ffffff", d: DROP_PATH }),
    h("g", { transform: `translate(59 ${24 - WORDMARK.height / 2})` },
      h("path", { fill: "#ffffff", d: WORDMARK.karsu }),
      h("path", { fill: "#5B97F7", d: WORDMARK.seal })));
}

function card({ eyebrow, title, subtitle, specs = [], badge }) {
  const flex = (style, ...c) => h("div", { style: { display: "flex", ...style } }, ...c);
  return flex({ width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", background: NAVY, color: "#fff", fontFamily: "Bricolage, BricolageExt", position: "relative" },
    flex({ position: "absolute", right: -140, top: -140, width: 520, height: 520, borderRadius: 9999, border: "56px solid rgba(91,151,247,0.16)" }),
    flex({ position: "absolute", right: 60, top: 60, width: 200, height: 200, borderRadius: 9999, border: "20px solid rgba(255,255,255,0.06)" }),
    flex({ alignItems: "center", justifyContent: "space-between" },
      logo(),
      badge ? flex({ padding: "8px 18px", borderRadius: 10, background: BLUE, fontSize: 28, fontWeight: 700 }, badge) : null),
    flex({ flexDirection: "column", maxWidth: 1000 },
      flex({ fontSize: 26, fontWeight: 500, color: "#8DB6FA", letterSpacing: 2 }, clamp(eyebrow, 60).toLocaleUpperCase("tr")),
      flex({ marginTop: 14, fontSize: title.length > 40 ? 58 : 70, fontWeight: 700, lineHeight: 1.05 }, clamp(title, 80)),
      subtitle ? flex({ marginTop: 18, fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.72)", lineHeight: 1.3 }, clamp(subtitle, 140)) : null),
    flex({ gap: 16 },
      specs.length
        ? specs.slice(0, 4).map((s) =>
            flex({ flexDirection: "column", padding: "14px 20px", borderRadius: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", maxWidth: 270 },
              flex({ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.6)" }, clamp(s.label, 24)),
              flex({ marginTop: 4, fontSize: 24, fontWeight: 700 }, clamp(glyphs(s.value), 22))))
        : flex({ fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.72)" }, "karsuseal.com")));
}

async function render(file, data) {
  const svg = await satori(card(data), { width: W, height: H, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, png);
}

fs.rmSync(out, { recursive: true, force: true });
await render(path.join(out, "default.png"), {
  eyebrow: "Mekanik sızdırmazlık çözümleri",
  title: "Sızdırmazlıkta doğru parça, doğru zamanda.",
  subtitle: "Mekanik salmastralar, kartuş ve mikser salmastraları, döner başlıklar, örgü salmastralar, O-ringler ve conta ürünleri.",
});

const allCats = categories.flatMap((c) => [{ ...c, parent: null }, ...c.children.map((ch) => ({ ...ch, parent: c }))]);
const done = { products: [], categories: [] };
for (const c of allCats) {
  const ids = [c.slug, ...(c.children ?? []).map((x) => x.slug)];
  const count = products.filter((p) => ids.includes(p.category)).length;
  await render(path.join(out, "urunler", `${c.slug}.png`), {
    eyebrow: c.parent?.name ?? "Ürün grubu",
    title: c.name,
    subtitle: c.summary,
    specs: [{ label: "Ürün sayısı", value: String(count) }, ...(c.children ?? []).slice(0, 3).map((x) => ({ label: "Alt grup", value: x.name }))],
  });
  done.categories.push(c.slug);
}
for (const p of products) {
  const slug = slugify(p.code);
  const cat = allCats.find((c) => c.slug === p.category);
  await render(path.join(out, "urun", `${slug}.png`), {
    eyebrow: cat?.name ?? "Ürün",
    title: p.name.replace(`${p.code} `, ""),
    subtitle: p.summary,
    specs: p.specs,
    badge: p.code,
  });
  done.products.push(slug);
}

fs.writeFileSync(path.join(root, "src", "data", "og-images.json"), JSON.stringify(done, null, 2) + "\n");
const size = fs.readdirSync(out, { recursive: true }).filter((f) => f.endsWith(".png")).reduce((n, f) => n + fs.statSync(path.join(out, f)).size, 0);
console.log(`public/og → ${done.products.length + done.categories.length + 1} görsel (${(size / 1024 / 1024).toFixed(1)} MB)`);
