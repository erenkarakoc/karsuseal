// Karsu Seal logo generator.
// Converts the Bricolage Grotesque wordmark to outlines (no font dependency in
// the final SVGs) and writes every logo variant to public/brand/.
//
//   node scripts/generate-logos.mjs
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "brand");
const fontDir = path.join(root, "node_modules", "@fontsource", "bricolage-grotesque", "files");
fs.mkdirSync(outDir, { recursive: true });

const parse = (file) => {
  const buf = fs.readFileSync(path.join(fontDir, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const fontCache = new Map();
const loadFont = (weight) => {
  if (!fontCache.has(weight)) {
    fontCache.set(weight, {
      latin: parse(`bricolage-grotesque-latin-${weight}-normal.woff`),
      ext: parse(`bricolage-grotesque-latin-ext-${weight}-normal.woff`),
    });
  }
  return fontCache.get(weight);
};

// Brand colours (see public/brand/README.md)
export const COLORS = {
  navy: "#0B1F3F",
  blue: "#1D5FD1",
  white: "#FFFFFF",
  blueOnDark: "#5B97F7",
  black: "#000000",
};

// ---------------------------------------------------------------------------
// Icon: a knurled seal ring inside a rounded square; the ring holds a seal face
// with a drop in its centre. 48 × 48 grid.
// ---------------------------------------------------------------------------
const ICON = 48;
const f3 = (n) => +n.toFixed(3);
const circle = (cx, cy, r, sweep = 0) =>
  `M${f3(cx - r)} ${cy}a${r} ${r} 0 1 ${sweep} ${f3(r * 2)} 0a${r} ${r} 0 1 ${sweep} ${f3(-r * 2)} 0Z`;

function knurl(cx, cy, ro, ri, teeth, tw = 0.3) {
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = (i * 2 * Math.PI) / teeth, s = Math.PI / teeth;
    [[ri, a - s * (tw + 0.2)], [ro, a - s * tw], [ro, a + s * tw], [ri, a + s * (tw + 0.2)]].forEach(([r, t], j) => {
      d += (i === 0 && j === 0 ? "M" : "L") + f3(cx + r * Math.cos(t)) + " " + f3(cy + r * Math.sin(t));
    });
  }
  return d + "Z";
}

function dropPath(cx, top, w, h) {
  const r = w / 2, by = top + h - r;
  return `M${cx} ${top}C${cx} ${top} ${f3(cx + r)} ${f3(by - r * 0.9)} ${f3(cx + r)} ${f3(by)}` +
    `A${r} ${r} 0 0 1 ${f3(cx - r)} ${f3(by)}C${f3(cx - r)} ${f3(by - r * 0.9)} ${cx} ${top} ${cx} ${top}Z`;
}

const G = { inset: 1.5, radius: 14.25, ringOuter: 18.75, ringInner: 15.75, teeth: 18, hole: 11.625, disc: 8.625 };
const squarePath = (() => {
  const a = G.inset, b = ICON - G.inset, r = G.radius;
  return `M${a + r} ${a}H${b - r}A${r} ${r} 0 0 1 ${b} ${a + r}V${b - r}A${r} ${r} 0 0 1 ${b - r} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${b - r}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z`;
})();
const ringPath = knurl(24, 24, G.ringOuter, G.ringInner, G.teeth) + circle(24, 24, G.hole);
const DISC = circle(24, 24, G.disc);
const DROP = dropPath(24, 18.375, 6.75, 10.875);
// Single-colour version: ring and drop are cut out of the square (evenodd)
const MONO = squarePath + ringPath + DROP;

// scheme: { square, ring, disc, drop } colours, or { mono } for the knocked-out single colour mark
const iconBody = (c) =>
  c.mono
    ? `<path fill="${c.mono}" fill-rule="evenodd" d="${MONO}"/>`
    : `<path fill="${c.square}" d="${squarePath}"/><path fill="${c.ring}" fill-rule="evenodd" d="${ringPath}"/><path fill="${c.disc}" d="${DISC}"/><path fill="${c.drop}" d="${DROP}"/>`;
const iconGroup = (c, dx = 0, dy = 0, scale = 1) => `<g transform="translate(${dx} ${dy}) scale(${scale})">${iconBody(c)}</g>`;

// ---------------------------------------------------------------------------
// Text → outlined path
// ---------------------------------------------------------------------------
// opentype's own toPathData() occasionally emits NaN when rounding, so serialise ourselves
const n2 = (v) => {
  const s = (Math.round(v * 100) / 100).toString();
  return s === "-0" ? "0" : s;
};
function toPathData(cmds) {
  return cmds.map((c) => {
    switch (c.type) {
      case "M": case "L": return `${c.type}${n2(c.x)} ${n2(c.y)}`;
      case "Q": return `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`;
      case "C": return `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`;
      default: return "Z";
    }
  }).join("");
}

function textPath(text, weight, size, x, baseline, tracking = 0) {
  const font = loadFont(weight);
  let cursor = x;
  const parts = [];
  for (const ch of text) {
    const f = font.latin.charToGlyphIndex(ch) > 0 ? font.latin : font.ext;
    const glyph = f.charToGlyph(ch);
    const p = glyph.getPath(cursor, baseline, size);
    parts.push(toPathData(p.commands));
    cursor += (glyph.advanceWidth / f.unitsPerEm) * size + tracking * size;
  }
  return { d: parts.join(""), width: cursor - x - tracking * size };
}

// Bounding box from path coordinates (control points included — close enough for layout)
function measure(d) {
  const re = /([MLCQZ])([^MLCQZ]*)/gi;
  let m;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  while ((m = re.exec(d))) {
    const vals = (m[2].match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number);
    for (let i = 0; i + 1 < vals.length; i += 2) {
      minX = Math.min(minX, vals[i]); maxX = Math.max(maxX, vals[i]);
      minY = Math.min(minY, vals[i + 1]); maxY = Math.max(maxY, vals[i + 1]);
    }
  }
  return { minX, minY, maxX, maxY };
}

// Wordmark: "Karsu" (700) + "Seal" (400)
const WM = { size: 30, tracking: -0.01, space: 0.24 };
function wordmark(x, baseline, cKarsu, cSeal, size = WM.size) {
  const a = textPath("Karsu", 700, size, x, baseline, WM.tracking);
  const b = textPath("Seal", 400, size, x + a.width + WM.space * size, baseline, WM.tracking);
  const ba = measure(a.d), bb = measure(b.d);
  return {
    svg: `<path fill="${cKarsu}" d="${a.d}"/><path fill="${cSeal}" d="${b.d}"/>`,
    box: { minX: Math.min(ba.minX, bb.minX), minY: Math.min(ba.minY, bb.minY), maxX: Math.max(ba.maxX, bb.maxX), maxY: Math.max(ba.maxY, bb.maxY) },
  };
}

function tagline(x, baseline, color, size) {
  const t = textPath("MEKANİK SIZDIRMAZLIK ÇÖZÜMLERİ", 600, size, x, baseline, 0.14);
  return { svg: `<path fill="${color}" d="${t.d}"/>`, box: measure(t.d), width: t.width };
}

const r2 = (n) => Math.round(n * 100) / 100;
const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(w)} ${r2(h)}" width="${r2(w)}" height="${r2(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const write = (name, content) => {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log("  ✓", name);
};

// Colour schemes for every variant
const ICONS = {
  light: { square: COLORS.navy, ring: COLORS.white, disc: COLORS.blueOnDark, drop: COLORS.white },
  dark: { square: COLORS.blue, ring: COLORS.white, disc: COLORS.navy, drop: COLORS.white },
  blue: { square: COLORS.blue, ring: COLORS.white, disc: COLORS.navy, drop: COLORS.white },
};
const schemes = {
  light: { icon: ICONS.light, karsu: COLORS.navy, seal: COLORS.blue, tag: COLORS.navy },
  dark: { icon: ICONS.dark, karsu: COLORS.white, seal: COLORS.blueOnDark, tag: COLORS.white },
  "mono-black": { icon: { mono: COLORS.black }, karsu: COLORS.black, seal: COLORS.black, tag: COLORS.black },
  "mono-white": { icon: { mono: COLORS.white }, karsu: COLORS.white, seal: COLORS.white, tag: COLORS.white },
};

console.log("Karsu Seal logo variants → public/brand/");

for (const [key, c] of Object.entries(schemes)) {
  // 1) Icon only
  write(`karsu-seal-icon-${key}.svg`, svg(ICON, ICON, iconGroup(c.icon), "Karsu Seal"));

  // 2) Horizontal lockup: icon + wordmark, text optically centred on the ring
  {
    const gap = 11;
    const probe = wordmark(0, 0, c.karsu, c.seal);
    const textH = probe.box.maxY - probe.box.minY;
    const baseline = ICON / 2 + textH / 2 - (probe.box.maxY) ;
    const wm = wordmark(ICON + gap, baseline, c.karsu, c.seal);
    const w = wm.box.maxX + 0.5;
    write(`karsu-seal-logo-horizontal-${key}.svg`, svg(w, ICON, iconGroup(c.icon) + wm.svg, "Karsu Seal"));

    // 2b) Horizontal lockup with tagline under the wordmark
    const tagSize = 7.2;
    const H = 56;
    const iconScale = H / ICON;
    const x0 = H + gap;
    const wmBase = 27;
    const wm2 = wordmark(x0, wmBase, c.karsu, c.seal);
    const tag = tagline(x0 + 0.6, wmBase + 14.5, c.tag, tagSize);
    const w2 = Math.max(wm2.box.maxX, tag.box.maxX) + 0.5;
    write(`karsu-seal-logo-tagline-${key}.svg`, svg(w2, H, iconGroup(c.icon, 0, 0, iconScale) + wm2.svg + tag.svg, "Karsu Seal — Mekanik Sızdırmazlık Çözümleri"));
  }

  // 3) Stacked lockup: icon above centred wordmark
  {
    const probe = wordmark(0, 0, c.karsu, c.seal);
    const tw = probe.box.maxX - probe.box.minX;
    const iconSize = 64;
    const w = Math.max(tw, iconSize);
    const baseline = iconSize + 14 - probe.box.minY;
    const wm = wordmark((w - tw) / 2 - probe.box.minX, baseline, c.karsu, c.seal);
    const h = wm.box.maxY + 0.5;
    write(`karsu-seal-logo-stacked-${key}.svg`, svg(w, h, iconGroup(c.icon, (w - iconSize) / 2, 0, iconSize / ICON) + wm.svg, "Karsu Seal"));
  }

  // 4) Wordmark only
  {
    const probe = wordmark(0, 0, c.karsu, c.seal);
    const wm = wordmark(-probe.box.minX, -probe.box.minY, c.karsu, c.seal);
    write(`karsu-seal-wordmark-${key}.svg`, svg(wm.box.maxX + 0.5, wm.box.maxY + 0.5, wm.svg, "Karsu Seal"));
  }
}

// 5) App icon: the square of the mark fills the whole canvas
const appIcon = (size, rx, c, ringRadius = G.ringOuter * (size / (ICON - G.inset * 2))) => {
  const k = ringRadius / G.ringOuter, o = size / 2 - 24 * k;
  return svg(size, size,
    `<rect width="${size}" height="${size}" rx="${rx}" fill="${c.square}"/>` +
    `<g transform="translate(${f3(o)} ${f3(o)}) scale(${f3(k)})"><path fill="${c.ring}" fill-rule="evenodd" d="${ringPath}"/><path fill="${c.disc}" d="${DISC}"/><path fill="${c.drop}" d="${DROP}"/></g>`,
    "Karsu Seal");
};
const APP_RX = f3(G.radius * (512 / (ICON - G.inset * 2)));
write("karsu-seal-app-icon.svg", appIcon(512, APP_RX, ICONS.blue));
write("karsu-seal-app-icon-navy.svg", appIcon(512, APP_RX, ICONS.light));

// 6) Adaptive favicon: follows the OS colour scheme
{
  const body = `<style>.s{fill:${COLORS.navy}}.c{fill:${COLORS.blueOnDark}}@media (prefers-color-scheme:dark){.s{fill:${COLORS.blue}}.c{fill:${COLORS.navy}}}</style>` +
    `<path class="s" d="${squarePath}"/><path fill="${COLORS.white}" fill-rule="evenodd" d="${ringPath}"/><path class="c" d="${DISC}"/><path fill="${COLORS.white}" d="${DROP}"/>`;
  write("karsu-seal-favicon.svg", svg(ICON, ICON, body, "Karsu Seal"));
  // Next.js file-convention favicon
  fs.copyFileSync(path.join(outDir, "karsu-seal-favicon.svg"), path.join(root, "src", "app", "icon.svg"));
  console.log("  ✓ src/app/icon.svg");
}

// 7) PNG icons for the web app manifest, iOS home screen and social previews
{
  const { Resvg } = await import("@resvg/resvg-js");
  const png = (svgText, size) => new Resvg(svgText, { fitTo: { mode: "width", value: size } }).render().asPng();
  const pngDir = path.join(outDir, "png");
  fs.mkdirSync(pngDir, { recursive: true });
  const outputs = [
    ["icon-192.png", appIcon(512, APP_RX, ICONS.light), 192],
    ["icon-512.png", appIcon(512, APP_RX, ICONS.light), 512],
    // maskable: full-bleed background, ring inside the 80% safe zone
    ["icon-maskable-512.png", appIcon(512, 0, ICONS.light, 180), 512],
    // iOS rounds the corners itself
    ["apple-touch-icon.png", appIcon(512, 0, ICONS.light), 180],
    ["favicon-48.png", svg(ICON, ICON, iconGroup(ICONS.light), "Karsu Seal"), 48],
    ["logo-horizontal-light.png", fs.readFileSync(path.join(outDir, "karsu-seal-logo-horizontal-light.svg"), "utf8"), 1200],
  ];
  for (const [name, text, size] of outputs) {
    fs.writeFileSync(path.join(pngDir, name), png(text, size));
    console.log("  ✓ png/" + name);
  }
  // Next.js file-convention icon for iOS
  fs.copyFileSync(path.join(pngDir, "apple-touch-icon.png"), path.join(root, "src", "app", "apple-icon.png"));
  console.log("  ✓ src/app/apple-icon.png");
}

// Export raw geometry for the React <Logo> component
fs.writeFileSync(
  path.join(root, "src", "components", "brand", "logo-paths.ts"),
  `// Generated by scripts/generate-logos.mjs — do not edit by hand.\n` +
    `export const SQUARE_PATH = ${JSON.stringify(squarePath)};\n` +
    `export const RING_PATH = ${JSON.stringify(ringPath)};\n` +
    `export const DISC_PATH = ${JSON.stringify(DISC)};\n` +
    `export const DROP_PATH = ${JSON.stringify(DROP)};\n` +
    `export const MONO_PATH = ${JSON.stringify(MONO)};\n` +
    (() => {
      const probe = wordmark(0, 0, "", "");
      const wm = wordmark(-probe.box.minX, -probe.box.minY, "", "");
      const a = textPath("Karsu", 700, WM.size, -probe.box.minX, -probe.box.minY, WM.tracking);
      const b = textPath("Seal", 400, WM.size, -probe.box.minX + a.width + WM.space * WM.size, -probe.box.minY, WM.tracking);
      return `export const WORDMARK = { width: ${r2(wm.box.maxX + 0.5)}, height: ${r2(wm.box.maxY + 0.5)}, karsu: ${JSON.stringify(a.d)}, seal: ${JSON.stringify(b.d)} };\n`;
    })(),
);
console.log("  ✓ src/components/brand/logo-paths.ts");
