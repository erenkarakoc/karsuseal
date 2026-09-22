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
// Icon: a closed seal ring holding a drop that is split into two faces
// (rotating + stationary face of a mechanical seal). 48 × 48 grid.
// ---------------------------------------------------------------------------
const ICON = 48;
const ring = { cx: 24, cy: 24, r: 18.75, stroke: 5.5 };

function dropPaths() {
  const cx = 24, cy = 28.5, r = 7.5, tipY = 12.5, gap = 1.25; // gap = half interface width
  const d = cy - tipY;
  const t = Math.asin(r / d);
  const tx = r * Math.cos(t), ty = r * Math.sin(t);
  const yTop = cy - gap, yBot = cy + gap;
  const hx = Math.sqrt(r * r - gap * gap);
  const f = (n) => +n.toFixed(3);
  const top = `M${cx} ${tipY}L${f(cx + tx)} ${f(cy - ty)}A${r} ${r} 0 0 1 ${f(cx + hx)} ${f(yTop)}L${f(cx - hx)} ${f(yTop)}A${r} ${r} 0 0 1 ${f(cx - tx)} ${f(cy - ty)}Z`;
  const bottom = `M${f(cx + hx)} ${f(yBot)}A${r} ${r} 0 0 1 ${f(cx - hx)} ${f(yBot)}Z`;
  return top + bottom;
}

const ringPath = (() => {
  // ring as a filled annulus so the file has no strokes (scales predictably)
  const ro = ring.r + ring.stroke / 2, ri = ring.r - ring.stroke / 2, { cx, cy } = ring;
  return `M${cx - ro} ${cy}a${ro} ${ro} 0 1 0 ${ro * 2} 0a${ro} ${ro} 0 1 0 ${-ro * 2} 0Z` +
    `M${cx - ri} ${cy}a${ri} ${ri} 0 1 1 ${ri * 2} 0a${ri} ${ri} 0 1 1 ${-ri * 2} 0Z`;
})();
const DROP = dropPaths();

const iconGroup = (ringFill, dropFill, dx = 0, dy = 0, scale = 1) =>
  `<g transform="translate(${dx} ${dy}) scale(${scale})"><path fill="${ringFill}" fill-rule="evenodd" d="${ringPath}"/><path fill="${dropFill}" d="${DROP}"/></g>`;

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
const schemes = {
  light: { ring: COLORS.navy, drop: COLORS.blue, karsu: COLORS.navy, seal: COLORS.blue, tag: COLORS.navy },
  dark: { ring: COLORS.white, drop: COLORS.blueOnDark, karsu: COLORS.white, seal: COLORS.blueOnDark, tag: COLORS.white },
  "mono-black": { ring: COLORS.black, drop: COLORS.black, karsu: COLORS.black, seal: COLORS.black, tag: COLORS.black },
  "mono-white": { ring: COLORS.white, drop: COLORS.white, karsu: COLORS.white, seal: COLORS.white, tag: COLORS.white },
};

console.log("Karsu Seal logo variants → public/brand/");

for (const [key, c] of Object.entries(schemes)) {
  // 1) Icon only
  write(`karsu-seal-icon-${key}.svg`, svg(ICON, ICON, iconGroup(c.ring, c.drop), "Karsu Seal"));

  // 2) Horizontal lockup: icon + wordmark, text optically centred on the ring
  {
    const gap = 11;
    const probe = wordmark(0, 0, c.karsu, c.seal);
    const textH = probe.box.maxY - probe.box.minY;
    const baseline = ICON / 2 + textH / 2 - (probe.box.maxY) ;
    const wm = wordmark(ICON + gap, baseline, c.karsu, c.seal);
    const w = wm.box.maxX + 0.5;
    write(`karsu-seal-logo-horizontal-${key}.svg`, svg(w, ICON, iconGroup(c.ring, c.drop) + wm.svg, "Karsu Seal"));

    // 2b) Horizontal lockup with tagline under the wordmark
    const tagSize = 7.2;
    const H = 56;
    const iconScale = H / ICON;
    const x0 = H + gap;
    const wmBase = 27;
    const wm2 = wordmark(x0, wmBase, c.karsu, c.seal);
    const tag = tagline(x0 + 0.6, wmBase + 14.5, c.tag, tagSize);
    const w2 = Math.max(wm2.box.maxX, tag.box.maxX) + 0.5;
    write(`karsu-seal-logo-tagline-${key}.svg`, svg(w2, H, iconGroup(c.ring, c.drop, 0, 0, iconScale) + wm2.svg + tag.svg, "Karsu Seal — Mekanik Sızdırmazlık Çözümleri"));
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
    write(`karsu-seal-logo-stacked-${key}.svg`, svg(w, h, iconGroup(c.ring, c.drop, (w - iconSize) / 2, 0, iconSize / ICON) + wm.svg, "Karsu Seal"));
  }

  // 4) Wordmark only
  {
    const probe = wordmark(0, 0, c.karsu, c.seal);
    const wm = wordmark(-probe.box.minX, -probe.box.minY, c.karsu, c.seal);
    write(`karsu-seal-wordmark-${key}.svg`, svg(wm.box.maxX + 0.5, wm.box.maxY + 0.5, wm.svg, "Karsu Seal"));
  }
}

// 5) App icon / favicon: white mark on the brand blue rounded square
{
  const s = 512, pad = 88, scale = (s - pad * 2) / ICON;
  const body = `<rect width="${s}" height="${s}" rx="112" fill="${COLORS.blue}"/>` + iconGroup(COLORS.white, COLORS.white, pad, pad, scale);
  write("karsu-seal-app-icon.svg", svg(s, s, body, "Karsu Seal"));
  const body2 = `<rect width="${s}" height="${s}" rx="112" fill="${COLORS.navy}"/>` + iconGroup(COLORS.white, COLORS.blueOnDark, pad, pad, scale);
  write("karsu-seal-app-icon-navy.svg", svg(s, s, body2, "Karsu Seal"));
}

// 6) Adaptive favicon: follows the OS colour scheme
{
  const body = `<style>.r{fill:${COLORS.navy}}.d{fill:${COLORS.blue}}@media (prefers-color-scheme:dark){.r{fill:${COLORS.white}}.d{fill:${COLORS.blueOnDark}}}</style>` +
    `<path class="r" fill-rule="evenodd" d="${ringPath}"/><path class="d" d="${DROP}"/>`;
  write("karsu-seal-favicon.svg", svg(ICON, ICON, body, "Karsu Seal"));
}

// Export raw geometry for the React <Logo> component
fs.writeFileSync(
  path.join(root, "src", "components", "brand", "logo-paths.ts"),
  `// Generated by scripts/generate-logos.mjs — do not edit by hand.\n` +
    `export const RING_PATH = ${JSON.stringify(ringPath)};\n` +
    `export const DROP_PATH = ${JSON.stringify(DROP)};\n` +
    (() => {
      const probe = wordmark(0, 0, "", "");
      const wm = wordmark(-probe.box.minX, -probe.box.minY, "", "");
      const a = textPath("Karsu", 700, WM.size, -probe.box.minX, -probe.box.minY, WM.tracking);
      const b = textPath("Seal", 400, WM.size, -probe.box.minX + a.width + WM.space * WM.size, -probe.box.minY, WM.tracking);
      return `export const WORDMARK = { width: ${r2(wm.box.maxX + 0.5)}, height: ${r2(wm.box.maxY + 0.5)}, karsu: ${JSON.stringify(a.d)}, seal: ${JSON.stringify(b.d)} };\n`;
    })(),
);
console.log("  ✓ src/components/brand/logo-paths.ts");
