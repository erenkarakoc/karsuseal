// Karsu Seal — standart ürün görselleri.
// Her ürün ailesi için aynı ölçü (800×600), ışık yönü, perspektif ve arka planla
// vektör görsel üretir → public/illustrations/<key>.svg
//
//   node scripts/generate-illustrations.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "illustrations");
fs.mkdirSync(outDir, { recursive: true });

const W = 800, H = 600, CY = 290;
const K = 0.34; // ellipse ratio for cylinders lying on the x axis (3/4 view)
const f = (n) => +n.toFixed(2);

// ---------------------------------------------------------------------------
// Materials: body = vertical gradient (cylindrical shading), face = diagonal gradient
// ---------------------------------------------------------------------------
const MATERIALS = {
  steel: { body: ["#6f7a86", "#c9d1da", "#f7f9fb", "#d4dbe3", "#9aa5b1", "#5b6570"], face: ["#f3f6f9", "#c5cdd6", "#8e99a5"], edge: "#4b545e" },
  steelDark: { body: ["#4f5863", "#99a3ae", "#d7dde3", "#aab3bd", "#6f7984", "#3d454e"], face: ["#d9dfe5", "#a3adb8", "#6b7581"], edge: "#353c44" },
  carbon: { body: ["#15171a", "#3b4048", "#6b727c", "#3a3f46", "#1d2024", "#0c0d0f"], face: ["#5d646e", "#2a2e34", "#101214"], edge: "#060708" },
  sic: { body: ["#3a4049", "#6f7985", "#a9b3bf", "#7c8691", "#4c545e", "#2b3037"], face: ["#b6bfca", "#7d8793", "#4a525c"], edge: "#22272d" },
  tc: { body: ["#7a7f86", "#c4c9cf", "#eef1f4", "#c9ced4", "#8d939a", "#62676e"], face: ["#f4f6f8", "#c6cbd1", "#8a9097"], edge: "#50555b" },
  ceramic: { body: ["#c9c5b8", "#ece9df", "#fffdf6", "#efece2", "#d4d0c3", "#b3ae9f"], face: ["#fffef9", "#ece8dc", "#cfcabb"], edge: "#9e998a" },
  rubber: { body: ["#0d0e10", "#26292d", "#40444a", "#282b2f", "#141517", "#070808"], face: ["#3b3f45", "#1f2226", "#0c0d0f"], edge: "#000000" },
  cast: { body: ["#3f4a57", "#76828f", "#a6b1bd", "#7f8b97", "#55606c", "#333c46"], face: ["#b3bdc8", "#7d8894", "#505a66"], edge: "#2a323b" },
  brass: { body: ["#7a5a1c", "#c79b3f", "#f2d488", "#cfa550", "#946d25", "#5f4413"], face: ["#f5dc98", "#c99d44", "#8a6420"], edge: "#4d370f" },
  blue: { body: ["#123a7a", "#2a63c4", "#6d9df0", "#3570d6", "#1c4ea8", "#0e2d61"], face: ["#78a6f2", "#3a73d8", "#1a4799"], edge: "#0b2350" },
  orange: { body: ["#9a4a0b", "#e07a1f", "#ffb266", "#ea8a33", "#b85c12", "#7a3a08"], face: ["#ffc080", "#e8842a", "#a95410"], edge: "#6a3206" },
  hole: { body: ["#0b0c0e", "#1d2024", "#2c3036", "#1a1d21", "#0b0c0e", "#050506"], face: ["#1c1f23", "#0e0f11", "#050506"], edge: "#000000" },
};

function defs() {
  const out = [];
  for (const [name, mat] of Object.entries(MATERIALS)) {
    const stops = mat.body.map((c, i) => `<stop offset="${f((i / (mat.body.length - 1)) * 100)}%" stop-color="${c}"/>`).join("");
    out.push(`<linearGradient id="${name}-b" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`);
    const fs2 = mat.face.map((c, i) => `<stop offset="${f((i / (mat.face.length - 1)) * 100)}%" stop-color="${c}"/>`).join("");
    out.push(`<linearGradient id="${name}-f" x1="0" y1="0" x2="1" y2="1">${fs2}</linearGradient>`);
    // horizontal variant for vertical cylinders
    out.push(`<linearGradient id="${name}-h" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>`);
  }
  return out.join("");
}

function frame(body, { shadowW = 520, shadowY = 470 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<radialGradient id="bg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#ffffff"/><stop offset="65%" stop-color="#eef2f7"/><stop offset="100%" stop-color="#dfe6ee"/></radialGradient>
<filter id="blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2"/></filter>
${defs()}
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<ellipse cx="${W / 2}" cy="${shadowY}" rx="${shadowW / 2}" ry="18" fill="#0b1f3f" opacity="0.22" filter="url(#blur)"/>
${body}
</svg>
`;
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------
/** Horizontal cylinder (axis on x). Front face at x0 is visible. */
function cyl({ x0, x1, R, r = 0, mat = "steel", cy = CY, faceMat, holeMat = "hole", noFace = false }) {
  const kR = K * R, kr = K * r;
  const m = MATERIALS[mat];
  const body = `<path d="M${f(x0)} ${f(cy - R)}H${f(x1)}A${f(kR)} ${f(R)} 0 0 1 ${f(x1)} ${f(cy + R)}H${f(x0)}Z" fill="url(#${mat}-b)" stroke="${m.edge}" stroke-opacity="0.45" stroke-width="1"/>`;
  if (noFace) return body;
  const fm = faceMat ?? mat;
  const face = `<ellipse cx="${f(x0)}" cy="${cy}" rx="${f(kR)}" ry="${R}" fill="url(#${fm}-f)" stroke="${m.edge}" stroke-opacity="0.5" stroke-width="1"/>`;
  const hole = r > 0 ? `<ellipse cx="${f(x0)}" cy="${cy}" rx="${f(kr)}" ry="${r}" fill="url(#${holeMat}-f)"/>` +
    // visible inner bore wall (right half of hole shows the inside)
    `<path d="M${f(x0)} ${f(cy - r)}A${f(kr)} ${f(r)} 0 0 1 ${f(x0)} ${f(cy + r)}A${f(kr * 0.55)} ${f(r)} 0 0 0 ${f(x0)} ${f(cy - r)}Z" fill="#000" opacity="0.35"/>` : "";
  return body + face + hole;
}

/** Specular highlight line on a cylinder body */
const sheen = (x0, x1, R, cy = CY, o = 0.55) =>
  x1 - x0 - K * R <= 4 ? "" :
  `<rect x="${f(x0 + K * R * 0.9)}" y="${f(cy - R * 0.52)}" width="${f(x1 - x0 - K * R * 0.9)}" height="${f(Math.max(1.5, R * 0.05))}" rx="1" fill="#fff" opacity="${o}"/>`;

/** Helical spring around the x axis. radii: [start, end] for conical springs. */
function spring({ x0, x1, R0, R1 = R0, turns = 6, wire = 6, cy = CY, color = "#c9d1da", back = "#5f6974", front = true }) {
  const pitch = (x1 - x0) / turns;
  let backP = "", frontP = "";
  for (let i = 0; i < turns; i++) {
    const xa = x0 + i * pitch, xb = xa + pitch / 2, xc = xa + pitch;
    const Ra = R0 + (R1 - R0) * (i / turns), Rb = R0 + (R1 - R0) * ((i + 0.5) / turns), Rc = R0 + (R1 - R0) * ((i + 1) / turns);
    frontP += `M${f(xa)} ${f(cy - Ra)}A${f(K * Rb)} ${f(Rb)} 0 0 0 ${f(xb)} ${f(cy + Rb)}`;
    backP += `M${f(xb)} ${f(cy + Rb)}A${f(K * Rc)} ${f(Rc)} 0 0 0 ${f(xc)} ${f(cy - Rc)}`;
  }
  const b = `<path d="${backP}" fill="none" stroke="${back}" stroke-width="${wire}" stroke-linecap="round"/>`;
  const fr = front
    ? `<path d="${frontP}" fill="none" stroke="#3d454e" stroke-width="${wire + 1.5}" stroke-linecap="round"/>` +
      `<path d="${frontP}" fill="none" stroke="${color}" stroke-width="${wire}" stroke-linecap="round"/>` +
      `<path d="${frontP}" fill="none" stroke="#ffffff" stroke-width="${wire * 0.3}" stroke-linecap="round" opacity="0.7" transform="translate(-1 -1)"/>`
    : "";
  return { back: b, front: fr };
}

/** Set screw heads on a cylinder body */
const screws = (x, R, cy = CY, n = 1) =>
  Array.from({ length: n }, (_, i) => {
    const y = cy - R * (0.55 - i * 0.55);
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="6" ry="6.5" fill="#1b1f24"/><path d="M${f(x - 3)} ${f(y)}h6M${f(x)} ${f(y - 3)}v6" stroke="#5b6570" stroke-width="1.5"/>`;
  }).join("");

/** Place a list of parts right-to-left so the left-most (front) part is painted last. */
const stack = (parts) => [...parts].reverse().join("");

// ---------------------------------------------------------------------------
// Mechanical seal families
// ---------------------------------------------------------------------------
function sealConical() {
  const x = 150;
  const sp = spring({ x0: x + 92, x1: x + 330, R0: 96, R1: 70, turns: 5, wire: 9 });
  return frame(
    sp.back +
      stack([
        cyl({ x0: x, x1: x + 30, R: 118, r: 62, mat: "sic" }) + sheen(x, x + 30, 118),
        cyl({ x0: x + 30, x1: x + 38, R: 104, r: 62, mat: "rubber", noFace: true }),
        cyl({ x0: x + 38, x1: x + 66, R: 92, r: 58, mat: "carbon" }) + sheen(x + 38, x + 66, 92, CY, 0.25),
        cyl({ x0: x + 66, x1: x + 92, R: 100, r: 58, mat: "steel" }) + sheen(x + 66, x + 92, 100),
      ]) +
      stack([cyl({ x0: x + 330, x1: x + 400, R: 76, r: 52, mat: "steel" }) + sheen(x + 330, x + 400, 76) + screws(x + 368, 76)]) +
      sp.front,
    { shadowW: 560 },
  );
}

function sealMultispring() {
  const x = 170;
  const holder = (x0, x1) =>
    cyl({ x0, x1, R: 108, r: 60, mat: "steel" }) + sheen(x0, x1, 108) +
    // spring pockets visible through small windows
    Array.from({ length: 4 }, (_, i) => `<rect x="${f(x0 + 14 + i * 20)}" y="${CY - 76}" width="10" height="34" rx="3" fill="#2a3037"/><path d="M${f(x0 + 15 + i * 20)} ${CY - 72}l8 6m-8 4l8 6m-8 4l8 6m-8 4l8 6" stroke="#aeb7c1" stroke-width="2"/>`).join("");
  return frame(
    stack([
      cyl({ x0: x, x1: x + 30, R: 124, r: 64, mat: "sic" }) + sheen(x, x + 30, 124),
      cyl({ x0: x + 30, x1: x + 38, R: 110, r: 64, mat: "rubber", noFace: true }),
      cyl({ x0: x + 38, x1: x + 70, R: 96, r: 60, mat: "carbon" }) + sheen(x + 38, x + 70, 96, CY, 0.25),
      holder(x + 70, x + 190),
      cyl({ x0: x + 190, x1: x + 260, R: 100, r: 60, mat: "steel" }) + sheen(x + 190, x + 260, 100) + screws(x + 226, 100, CY, 2),
    ]),
  );
}

function sealDouble() {
  const x = 110;
  const unit = (x0, flip) => {
    const parts = [
      cyl({ x0, x1: x0 + 26, R: 116, r: 62, mat: "sic" }) + sheen(x0, x0 + 26, 116),
      cyl({ x0: x0 + 26, x1: x0 + 52, R: 92, r: 58, mat: "carbon" }),
      cyl({ x0: x0 + 52, x1: x0 + 140, R: 102, r: 58, mat: "steel" }) + sheen(x0 + 52, x0 + 140, 102) + screws(x0 + 110, 102),
    ];
    return flip ? parts : parts;
  };
  const left = unit(x, false);
  const right = [
    cyl({ x0: x + 140, x1: x + 228, R: 102, r: 58, mat: "steel" }) + sheen(x + 140, x + 228, 102),
    cyl({ x0: x + 228, x1: x + 254, R: 92, r: 58, mat: "carbon" }),
    cyl({ x0: x + 254, x1: x + 280, R: 116, r: 62, mat: "sic" }) + sheen(x + 254, x + 280, 116),
  ];
  // a sleeve drawn behind the back unit
  return frame(stack([...left, ...right, cyl({ x0: x + 280, x1: x + 560, R: 60, r: 48, mat: "steelDark" }) + sheen(x + 280, x + 560, 60, CY, 0.35)]));
}

function sealElastomerBellows() {
  const x = 170;
  const sp = spring({ x0: x + 104, x1: x + 290, R0: 96, R1: 96, turns: 6, wire: 8 });
  // bellows folds
  const folds = Array.from({ length: 3 }, (_, i) => `<path d="M${x + 118 + i * 26} ${CY - 78}q9 78 0 156" stroke="#000" stroke-opacity="0.5" stroke-width="3" fill="none"/>`).join("");
  return frame(
    stack([
      cyl({ x0: x, x1: x + 36, R: 124, r: 64, mat: "rubber" }),
      cyl({ x0: x + 8, x1: x + 36, R: 106, r: 64, mat: "ceramic", noFace: true }),
    ]) +
      `<ellipse cx="${x + 1}" cy="${CY}" rx="${f(K * 106)}" ry="106" fill="url(#ceramic-f)"/><ellipse cx="${x + 1}" cy="${CY}" rx="${f(K * 64)}" ry="64" fill="url(#hole-f)"/>` +
      sp.back +
      stack([
        cyl({ x0: x + 44, x1: x + 72, R: 90, r: 58, mat: "carbon" }),
        cyl({ x0: x + 72, x1: x + 104, R: 100, r: 58, mat: "steel" }) + sheen(x + 72, x + 104, 100),
        cyl({ x0: x + 104, x1: x + 300, R: 84, r: 54, mat: "rubber" }) + folds,
        cyl({ x0: x + 300, x1: x + 340, R: 100, r: 54, mat: "steel" }) + sheen(x + 300, x + 340, 100),
      ]) +
      sp.front,
  );
}

function sealMetalBellows() {
  const x = 150;
  const plates = [];
  for (let i = 0; i < 14; i++) {
    const x0 = x + 104 + i * 12;
    const big = i % 2 === 0;
    plates.push(cyl({ x0, x1: x0 + 12, R: big ? 110 : 94, r: 70, mat: big ? "steel" : "steelDark" }));
  }
  return frame(
    stack([
      cyl({ x0: x, x1: x + 30, R: 124, r: 66, mat: "sic" }) + sheen(x, x + 30, 124),
      cyl({ x0: x + 30, x1: x + 38, R: 110, r: 66, mat: "rubber", noFace: true }),
      cyl({ x0: x + 38, x1: x + 70, R: 94, r: 62, mat: "carbon" }),
      cyl({ x0: x + 70, x1: x + 104, R: 104, r: 62, mat: "steel" }) + sheen(x + 70, x + 104, 104),
      ...plates,
      cyl({ x0: x + 272, x1: x + 350, R: 106, r: 62, mat: "steel" }) + sheen(x + 272, x + 350, 106) + screws(x + 312, 106, CY, 2),
    ]),
  );
}

function glandPlate(x0, x1, R, r, { ports = 1, split = false } = {}) {
  const kR = K * R;
  let s = cyl({ x0, x1, R, r, mat: "steel" }) + sheen(x0, x1, R);
  // bolt slots on the front face
  for (const a of [-60, 60, 120, 240]) {
    const t = (a * Math.PI) / 180;
    const cx = x0 + Math.cos(t) * kR * 0.78, cy = CY + Math.sin(t) * R * 0.78;
    s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(K * 16)}" ry="16" fill="url(#hole-f)"/>`;
  }
  // flush / quench ports on the cylindrical rim (top)
  for (let i = 0; i < ports; i++) {
    const px = x0 + (x1 - x0) * ((i + 1) / (ports + 1));
    s += `<rect x="${f(px - 12)}" y="${CY - R - 10}" width="24" height="16" rx="3" fill="url(#steelDark-h)" stroke="#353c44" stroke-opacity=".5"/><ellipse cx="${f(px)}" cy="${CY - R - 10}" rx="12" ry="4" fill="#1b1f24"/>`;
  }
  if (split) s += `<path d="M${f(x0 - kR)} ${CY}H${f(x1 + K * R)}" stroke="#2a3037" stroke-width="2.5"/>`;
  return s;
}

function sealCartridge(double = false, split = false) {
  const x = double ? 170 : 200;
  const gl = double ? 110 : 56;
  const clips = [0, 1].map((i) => `<path d="M${x + 40 + i * 0} ${CY - 118 + i * 236 - (i ? 30 : 0)}h34v30h-34z" fill="url(#orange-b)" stroke="#6a3206" stroke-opacity=".5"/>`).join("");
  return frame(
    stack([
      cyl({ x0: x - 40, x1: x, R: 60, r: 50, mat: "steelDark" }) + sheen(x - 40, x, 60, CY, 0.3),
      cyl({ x0: x, x1: x + 54, R: 104, r: 60, mat: "steel" }) + sheen(x, x + 54, 104) + screws(x + 28, 104, CY, 2),
      glandPlate(x + 60, x + 60 + gl, 168, 62, { ports: double ? 2 : 1, split }),
      cyl({ x0: x + 60 + gl, x1: x + 60 + gl + 110, R: 96, r: 60, mat: "steel" }) + sheen(x + 60 + gl, x + 170 + gl, 96),
      cyl({ x0: x + 170 + gl, x1: x + 196 + gl, R: 86, r: 60, mat: "carbon" }),
    ]) + (split ? "" : clips),
    { shadowW: 600 },
  );
}

function sealAgitator() {
  const x = 150;
  let flange = cyl({ x0: x + 150, x1: x + 180, R: 196, r: 70, mat: "steel" }) + sheen(x + 150, x + 180, 196);
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2 + Math.PI / 8;
    flange += `<ellipse cx="${f(x + 150 + Math.cos(t) * K * 196 * 0.84)}" cy="${f(CY + Math.sin(t) * 196 * 0.84)}" rx="${f(K * 11)}" ry="11" fill="url(#hole-f)"/>`;
  }
  const port = (px, R) => `<rect x="${px - 13}" y="${CY - R - 26}" width="26" height="30" rx="3" fill="url(#steelDark-h)"/><ellipse cx="${px}" cy="${CY - R - 26}" rx="13" ry="4.5" fill="#1b1f24"/>`;
  return frame(
    stack([
      cyl({ x0: x - 50, x1: x, R: 66, r: 54, mat: "steelDark" }) + sheen(x - 50, x, 66, CY, 0.3),
      cyl({ x0: x, x1: x + 44, R: 104, r: 66, mat: "steel" }) + sheen(x, x + 44, 104) + screws(x + 22, 104, CY, 2),
      cyl({ x0: x + 44, x1: x + 150, R: 142, r: 66, mat: "blue" }) + sheen(x + 44, x + 150, 142, CY, 0.35) + port(x + 76, 142) + port(x + 122, 142),
      flange,
      cyl({ x0: x + 180, x1: x + 300, R: 120, r: 66, mat: "steel" }) + sheen(x + 180, x + 300, 120),
    ]),
    { shadowW: 640, shadowY: 505 },
  );
}

// ---------------------------------------------------------------------------
// Rotary joints and swivel joints
// ---------------------------------------------------------------------------
function thread(x0, x1, R, cy = CY) {
  let s = "";
  for (let x = x0 + 6; x < x1 - 2; x += 7) s += `<path d="M${x} ${cy - R}q${f(-K * R * 0.9)} ${R} 0 ${2 * R}" stroke="#4b545e" stroke-opacity=".55" stroke-width="1.6" fill="none"/>`;
  return s;
}
function hexNut(x0, x1, R) {
  return cyl({ x0, x1, R, r: 0, mat: "steel" }) + `<path d="M${x0} ${CY - R * 0.5}H${x1}M${x0} ${CY + R * 0.5}H${x1}" stroke="#4b545e" stroke-opacity=".6"/>` + sheen(x0, x1, R);
}

function rotaryJoint(double = false) {
  const x = 130;
  const port = (px) =>
    `<rect x="${px - 30}" y="${CY - 150}" width="60" height="60" fill="url(#cast-h)"/>` +
    `<rect x="${px - 38}" y="${CY - 176}" width="76" height="30" rx="4" fill="url(#steel-h)" stroke="#4b545e" stroke-opacity=".5"/>` +
    `<ellipse cx="${px}" cy="${CY - 176}" rx="38" ry="12" fill="url(#steel-f)"/><ellipse cx="${px}" cy="${CY - 176}" rx="24" ry="7.5" fill="url(#hole-f)"/>`;
  const rear = double
    ? stack([
        cyl({ x0: x + 330, x1: x + 380, R: 74, r: 0, mat: "cast" }),
        cyl({ x0: x + 380, x1: x + 420, R: 52, r: 36, mat: "steel" }) + sheen(x + 380, x + 420, 52),
      ])
    : cyl({ x0: x + 330, x1: x + 364, R: 74, r: 0, mat: "cast" });
  const siphon = double ? cyl({ x0: x - 150, x1: x - 20, R: 16, r: 11, mat: "steel" }) : "";
  return frame(
    rear +
      port(x + 230) +
      stack([
        cyl({ x0: x - 20, x1: x + 60, R: 46, r: double ? 26 : 30, mat: "steel" }) + thread(x - 20, x + 60, 46),
        hexNut(x + 60, x + 92, 70),
        cyl({ x0: x + 92, x1: x + 130, R: 92, r: 0, mat: "steel" }) + sheen(x + 92, x + 130, 92),
        cyl({ x0: x + 130, x1: x + 330, R: 110, r: 0, mat: "cast" }) + sheen(x + 130, x + 330, 110, CY, 0.35) +
          `<text x="${x + 262}" y="${CY + 8}" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#e7ecf1" opacity=".55" letter-spacing="2">KARSU</text>`,
      ]) +
      siphon,
    { shadowW: 620 },
  );
}

function swivelJoint() {
  const x = 140;
  // vertical elbow leg (axis on y): body gradient horizontal, top face ellipse
  const vx = x + 380, R = 58;
  const vertical =
    `<path d="M${vx - R} ${CY - 200}V${CY - 10}A${R} ${f(K * R)} 0 0 0 ${vx + R} ${CY - 10}V${CY - 200}Z" fill="url(#steel-h)" stroke="#4b545e" stroke-opacity=".45"/>` +
    `<ellipse cx="${vx}" cy="${CY - 200}" rx="${R}" ry="${f(K * R)}" fill="url(#steel-f)"/><ellipse cx="${vx}" cy="${CY - 200}" rx="${R - 12}" ry="${f(K * (R - 12))}" fill="url(#hole-f)"/>` +
    `<path d="M${vx - R} ${CY - 180}h${2 * R}" stroke="#4b545e" stroke-opacity=".5"/>` + thread(0, 0, 0);
  const elbow = `<path d="M${vx - R} ${CY - 20}Q${vx - R} ${CY + 58} ${vx - 90} ${CY + 58}V${CY - 58}Q${vx - 60} ${CY - 58} ${vx - R} ${CY - 20}Z" fill="url(#steel-b)"/>` +
    `<path d="M${vx + R} ${CY - 20}Q${vx + R} ${CY + 58} ${vx} ${CY + 58}L${vx - 90} ${CY + 58}V${CY - 20}Z" fill="url(#steel-b)" opacity=".9"/>`;
  return frame(
    vertical + elbow +
      stack([
        cyl({ x0: x, x1: x + 70, R: 50, r: 38, mat: "steel" }) + thread(x, x + 70, 50),
        cyl({ x0: x + 70, x1: x + 110, R: 58, r: 38, mat: "steel" }) + sheen(x + 70, x + 110, 58),
        cyl({ x0: x + 110, x1: x + 250, R: 86, r: 0, mat: "steel" }) + sheen(x + 110, x + 250, 86) +
          // ball plugs + grease nipple
          `<ellipse cx="${x + 150}" cy="${CY - 40}" rx="8" ry="9" fill="#1b1f24"/><ellipse cx="${x + 200}" cy="${CY - 40}" rx="8" ry="9" fill="#1b1f24"/>` +
          `<rect x="${x + 170}" y="${CY - 104}" width="12" height="20" fill="url(#brass-h)"/><circle cx="${x + 176}" cy="${CY - 106}" r="7" fill="url(#brass-f)"/>`,
        cyl({ x0: x + 250, x1: x + 290, R: 62, r: 0, mat: "steel" }),
      ]),
    { shadowW: 560 },
  );
}

// ---------------------------------------------------------------------------
// Seal support vessel (vertical tank)
// ---------------------------------------------------------------------------
function supportVessel() {
  const cx = 360, R = 105, top = 110, bot = 430;
  const shell =
    `<path d="M${cx - R} ${top}V${bot}A${R} ${f(K * R * 1.1)} 0 0 0 ${cx + R} ${bot}V${top}Z" fill="url(#steel-h)" stroke="#4b545e" stroke-opacity=".5"/>` +
    `<path d="M${cx - R} ${top}A${R} ${R * 0.42} 0 0 1 ${cx + R} ${top}Z" fill="url(#steel-f)" stroke="#4b545e" stroke-opacity=".5"/>` +
    `<path d="M${cx - R} ${top + 40}h${2 * R}M${cx - R} ${bot - 30}h${2 * R}" stroke="#4b545e" stroke-opacity=".35"/>`;
  const legs = [-70, 70].map((d) => `<rect x="${cx + d - 8}" y="${bot + 10}" width="16" height="44" fill="url(#steelDark-h)"/>`).join("") +
    `<rect x="${cx - 110}" y="${bot + 50}" width="220" height="10" rx="3" fill="url(#steelDark-b)"/>`;
  const sight = `<rect x="${cx + R + 22}" y="${top + 50}" width="26" height="230" rx="6" fill="url(#steelDark-h)"/><rect x="${cx + R + 29}" y="${top + 60}" width="12" height="210" rx="3" fill="#bfe3f7"/><rect x="${cx + R + 29}" y="${top + 150}" width="12" height="120" rx="3" fill="#4ba3d8"/>` +
    `<path d="M${cx + R} ${top + 64}h24M${cx + R} ${top + 266}h24" stroke="url(#steel-b)" stroke-width="10"/>`;
  const gauge = `<path d="M${cx} ${top - 40}v-40" stroke="url(#steel-h)" stroke-width="12"/><circle cx="${cx}" cy="${top - 118}" r="46" fill="url(#steel-f)" stroke="#4b545e" stroke-opacity=".6"/><circle cx="${cx}" cy="${top - 118}" r="38" fill="#fbfcfd"/>` +
    Array.from({ length: 9 }, (_, i) => { const t = Math.PI * (0.75 + (i / 8) * 1.5); return `<path d="M${f(cx + Math.cos(t) * 30)} ${f(top - 118 + Math.sin(t) * 30)}L${f(cx + Math.cos(t) * 36)} ${f(top - 118 + Math.sin(t) * 36)}" stroke="#0b1f3f" stroke-width="2"/>`; }).join("") +
    `<path d="M${cx} ${top - 118}l20 -18" stroke="#d6452b" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${top - 118}" r="4" fill="#0b1f3f"/>`;
  const coil = `<path d="M${cx - R - 60} ${top + 90}h60M${cx - R - 60} ${top + 190}h60" stroke="url(#steel-b)" stroke-width="12"/>` +
    [top + 90, top + 190].map((y) => `<rect x="${cx - R - 84}" y="${y - 12}" width="26" height="24" rx="3" fill="url(#brass-b)"/>`).join("");
  return frame(shell + legs + sight + gauge + coil + `<text x="${cx - 36}" y="${top + 120}" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#4b545e" opacity=".5" letter-spacing="2">KARSU</text>`, { shadowW: 360, shadowY: bot + 70 });
}

// ---------------------------------------------------------------------------
// Braided packing (coil seen from above at an angle)
// ---------------------------------------------------------------------------
const PACKING = {
  ptfe: { base: "#f3f3ef", dark: "#c9c9c1", line: "#a9a99f" },
  "graphite-ptfe": { base: "#34373c", dark: "#15171a", line: "#6a7079" },
  synthetic: { base: "#ece4d3", dark: "#c4b99f", line: "#a39679" },
  ramie: { base: "#b9a888", dark: "#8d7c5d", line: "#6f6045" },
  aramid: { base: "#e6b43c", dark: "#b8861d", line: "#8e6512" },
  zebra: { base: "#2f3236", dark: "#15171a", line: "#6a7079", stripe: "#e6b43c" },
  graphite: { base: "#5b616a", dark: "#2c3036", line: "#9aa2ac" },
  "graphite-wire": { base: "#5b616a", dark: "#2c3036", line: "#c8ced6", wire: true },
  glass: { base: "#f7f6f0", dark: "#d8d6cb", line: "#b9b6a8" },
};

function packing(kind) {
  const c = PACKING[kind];
  const cx = 400, cy = 300, loops = 4, band = 30, r0 = 150, ky = 0.42, hgt = 30;
  const pat = `<pattern id="braid" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">` +
    `<rect width="16" height="16" fill="${c.base}"/>` +
    `<path d="M0 8L8 0M8 16L16 8M0 8L8 16M8 0L16 8" stroke="${c.line}" stroke-width="2.2"/>` +
    (c.wire ? `<path d="M0 4h16" stroke="#e6ebf0" stroke-width="1"/>` : "") +
    `</pattern>`;
  const outerR = r0 + loops * band;
  let s = `<defs>${pat}<radialGradient id="pkshade" cx="45%" cy="35%" r="70%"><stop offset="0%" stop-color="#fff" stop-opacity=".25"/><stop offset="100%" stop-color="#000" stop-opacity=".25"/></radialGradient></defs>`;
  // outer side wall
  s += `<path d="M${cx - outerR} ${cy}V${cy + hgt}A${outerR} ${f(outerR * ky)} 0 0 0 ${cx + outerR} ${cy + hgt}V${cy}Z" fill="${c.dark}"/>`;
  s += `<path d="M${cx - outerR} ${cy}V${cy + hgt}A${outerR} ${f(outerR * ky)} 0 0 0 ${cx + outerR} ${cy + hgt}V${cy}Z" fill="url(#braid)" opacity=".55"/>`;
  // top face: loops
  for (let i = loops; i >= 1; i--) {
    const R = r0 + i * band;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f(R * ky)}" fill="url(#braid)" stroke="${c.dark}" stroke-width="3"/>`;
    if (c.stripe) s += `<ellipse cx="${cx}" cy="${cy}" rx="${R - 3}" ry="${f((R - 3) * ky)}" fill="none" stroke="${c.stripe}" stroke-width="5"/>`;
  }
  // inner hole + inner wall
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${r0}" ry="${f(r0 * ky)}" fill="${c.dark}"/>`;
  s += `<path d="M${cx - r0} ${cy}A${r0} ${f(r0 * ky)} 0 0 1 ${cx + r0} ${cy}V${cy + hgt * 0.2}A${r0} ${f(r0 * ky)} 0 0 0 ${cx - r0} ${cy + hgt * 0.2}Z" fill="#000" opacity=".35"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${outerR}" ry="${f(outerR * ky)}" fill="url(#pkshade)"/>`;
  // loose end with square cross-section in front
  const ex = cx + 40, ey = cy + outerR * ky + 36;
  s += `<path d="M${ex - 170} ${ey}L${ex + 150} ${ey - 26}l0 ${band}L${ex - 170} ${ey + band}Z" fill="url(#braid)" stroke="${c.dark}" stroke-width="2"/>`;
  s += `<path d="M${ex + 150} ${ey - 26}l18 -12v${band}l-18 12Z" fill="${c.dark}"/>`;
  s += `<path d="M${ex - 170} ${ey}l18 -12L${ex + 168} ${ey - 38}L${ex + 150} ${ey - 26}Z" fill="url(#braid)" opacity=".85"/>`;
  if (c.stripe) s += `<path d="M${ex - 170} ${ey + 3}L${ex + 150} ${ey - 23}M${ex - 170} ${ey + band - 3}L${ex + 150} ${ey + band - 29}" stroke="${c.stripe}" stroke-width="5"/>`;
  return frame(s, { shadowW: 560, shadowY: 440 });
}

// ---------------------------------------------------------------------------
// O-rings (torus seen from above at an angle)
// ---------------------------------------------------------------------------
const ORING = {
  nbr: ["#050506", "#26282c", "#6b7078"],
  fkm: ["#1b0f0b", "#4a2a1f", "#9a6a55"],
  epdm: ["#070708", "#2b2d31", "#5c6168"],
  vmq: ["#6d1a0e", "#c8452f", "#f39a82"],
  ffkm: ["#0f1114", "#34383e", "#8a93a0"],
  fep: ["#7a2410", "#d0512e", "#ffd2b8"],
};
function oring(kind) {
  const [d, mid, hi] = ORING[kind];
  const ring = (cx, cy, R, t, ky = 0.45) => {
    const id = `or${Math.round(cx)}${Math.round(R)}`;
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${hi}"/><stop offset="35%" stop-color="${mid}"/><stop offset="100%" stop-color="${d}"/></linearGradient></defs>` +
      `<ellipse cx="${cx}" cy="${cy + t * 0.18}" rx="${R}" ry="${f(R * ky)}" fill="none" stroke="${d}" stroke-width="${t}"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f(R * ky)}" fill="none" stroke="url(#${id})" stroke-width="${t * 0.92}"/>` +
      `<ellipse cx="${cx}" cy="${cy - t * 0.22}" rx="${R}" ry="${f(R * ky)}" fill="none" stroke="#fff" stroke-opacity="${kind === "fep" ? 0.55 : 0.28}" stroke-width="${t * 0.14}"/>` +
      (kind === "fep" ? `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f(R * ky)}" fill="none" stroke="#fff6d8" stroke-opacity=".28" stroke-width="${t}"/>` : "");
  };
  return frame(ring(360, 260, 190, 46) + ring(560, 380, 90, 26), { shadowW: 600, shadowY: 430 });
}

// ---------------------------------------------------------------------------
// Seal faces (flat rings) and flat products
// ---------------------------------------------------------------------------
/** Flat ring lying on a table: top face ellipse annulus + side wall */
function flatRing(cx, cy, R, r, h, mat, ky = 0.42) {
  const m = MATERIALS[mat];
  return `<path d="M${cx - R} ${cy}V${cy + h}A${R} ${f(R * ky)} 0 0 0 ${cx + R} ${cy + h}V${cy}Z" fill="url(#${mat}-b)" stroke="${m.edge}" stroke-opacity=".4"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f(R * ky)}" fill="url(#${mat}-f)" stroke="${m.edge}" stroke-opacity=".4"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f(r * ky)}" fill="url(#hole-f)"/>` +
    `<path d="M${cx - r} ${cy}A${r} ${f(r * ky)} 0 0 0 ${cx + r} ${cy}V${cy + Math.min(h, r * ky)}A${r} ${f(r * ky)} 0 0 1 ${cx - r} ${cy + Math.min(h, r * ky)}Z" fill="url(#${mat}-b)" opacity=".75"/>` +
    // lapped band reflection
    `<ellipse cx="${cx}" cy="${cy}" rx="${f((R + r) / 2)}" ry="${f(((R + r) / 2) * ky)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${f((R - r) * 0.25)}"/>`;
}

function sealFace(mat) {
  return frame(flatRing(330, 250, 190, 110, 46, mat) + flatRing(580, 380, 110, 64, 34, mat), { shadowW: 620, shadowY: 440 });
}

function slab(x, y, w, d, h, top, side, front) {
  // parallelogram slab: top face, front face, right side
  const dx = d * 0.55, dy = d * 0.32;
  return `<path d="M${x} ${y}l${dx} ${-dy}h${w}l${-dx} ${dy}Z" fill="${top}"/>` +
    `<path d="M${x} ${y}h${w}v${h}h${-w}Z" fill="${front}"/>` +
    `<path d="M${x + w} ${y}l${dx} ${-dy}v${h}l${-dx} ${dy}Z" fill="${side}"/>`;
}

function ptfe() {
  const rod = (y, R, len) => stack([cyl({ x0: 200, x1: 200 + len, R, r: 0, mat: "ceramic", cy: y }) + sheen(200, 200 + len, R, y, 0.6)]);
  return frame(
    slab(150, 260, 460, 300, 36, "#fbfbf8", "#dcdcd4", "#ecece6") +
      slab(190, 232, 420, 260, 26, "#f7f7f2", "#d6d6ce", "#e6e6df") +
      rod(372, 34, 420) + rod(430, 26, 380) +
      cyl({ x0: 520, x1: 610, R: 60, r: 42, mat: "ceramic", cy: 440 }),
    { shadowW: 640, shadowY: 490 },
  );
}

function gasketSheet() {
  const ring = (cx, cy, R, r) =>
    `<path d="M${cx - R} ${cy}v10A${R} ${R * 0.42} 0 0 0 ${cx + R} ${cy + 10}v-10Z" fill="#3e5a44"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f(R * 0.42)}" fill="#6d8b6f"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f(r * 0.42)}" fill="url(#bg)"/>` +
    Array.from({ length: 8 }, (_, i) => { const t = (i / 8) * Math.PI * 2; const rr = (R + r) / 2; return `<ellipse cx="${f(cx + Math.cos(t) * rr)}" cy="${f(cy + Math.sin(t) * rr * 0.42)}" rx="9" ry="4" fill="url(#bg)"/>`; }).join("");
  return frame(
    slab(120, 300, 480, 320, 10, "#7d9a7f", "#4b6650", "#5b7760") + slab(150, 280, 440, 280, 8, "#86a288", "#4f6a54", "#607c64") + ring(470, 400, 150, 80),
    { shadowW: 640, shadowY: 480 },
  );
}

function rubberSheet() {
  return frame(
    slab(110, 350, 380, 300, 12, "#2e3136", "#0f1012", "#1b1d20") +
      cyl({ x0: 400, x1: 700, R: 90, r: 26, mat: "rubber", cy: 300 }) +
      `<path d="M${400 - K * 90} ${300 + 60}q20 40 -60 60" stroke="#000" stroke-opacity=".3" fill="none"/>`,
    { shadowW: 660, shadowY: 480 },
  );
}

function spiralGasket() {
  const cx = 400, cy = 290, ky = 0.42;
  let s = flatRing(cx, cy, 250, 175, 14, "orange", ky) + flatRing(cx, cy, 170, 110, 16, "steel", ky);
  // spiral winding lines on the steel band
  for (let r = 116; r < 168; r += 5) s += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f(r * ky)}" fill="none" stroke="${r % 2 ? "#2c3036" : "#e9edf1"}" stroke-width="2"/>`;
  s += flatRing(cx, cy, 108, 84, 12, "steelDark", ky).replace(/<path[^>]*opacity="\.75"\/>/, "");
  return frame(s, { shadowW: 580, shadowY: 440 });
}

function lapping() {
  const cx = 400, cy = 300, R = 260, ky = 0.36;
  let s = `<path d="M${cx - R} ${cy}V${cy + 40}A${R} ${R * ky} 0 0 0 ${cx + R} ${cy + 40}V${cy}Z" fill="url(#cast-b)"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * ky}" fill="url(#cast-f)"/>`;
  s += `<clipPath id="plate"><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * ky}"/></clipPath><g clip-path="url(#plate)" stroke="#2a323b" stroke-opacity=".35" stroke-width="2">`;
  for (let i = -10; i <= 10; i++) s += `<path d="M${cx + i * 26 - 200} ${cy - 200}l400 400"/><path d="M${cx + i * 26 + 200} ${cy - 200}l-400 400"/>`;
  s += `</g>`;
  s += flatRing(cx - 90, cy - 10, 96, 76, 34, "steel", ky) + flatRing(cx - 90, cy - 10, 56, 32, 20, "carbon", ky);
  s += flatRing(cx + 120, cy + 20, 80, 62, 30, "steel", ky) + flatRing(cx + 120, cy + 20, 46, 26, 16, "sic", ky);
  return frame(s, { shadowW: 620, shadowY: 400 + 60 });
}

// ---------------------------------------------------------------------------
// Render every key
// ---------------------------------------------------------------------------
const renderers = {
  "seal-conical": sealConical,
  "seal-multispring": sealMultispring,
  "seal-double": sealDouble,
  "seal-elastomer-bellows": sealElastomerBellows,
  "seal-metal-bellows": sealMetalBellows,
  "seal-cartridge": () => sealCartridge(false),
  "seal-cartridge-double": () => sealCartridge(true),
  "seal-split": () => sealCartridge(false, true),
  "seal-agitator": sealAgitator,
  "rotary-joint": () => rotaryJoint(false),
  "rotary-joint-double": () => rotaryJoint(true),
  "swivel-joint": swivelJoint,
  "seal-support-vessel": supportVessel,
  ...Object.fromEntries(Object.keys(PACKING).map((k) => [`packing-${k}`, () => packing(k)])),
  ...Object.fromEntries(Object.keys(ORING).map((k) => [`o-ring-${k}`, () => oring(k)])),
  "seal-face-carbon": () => sealFace("carbon"),
  "seal-face-sic": () => sealFace("sic"),
  "seal-face-tc": () => sealFace("tc"),
  "seal-face-ceramic": () => sealFace("ceramic"),
  ptfe,
  "gasket-sheet": gasketSheet,
  "rubber-sheet": rubberSheet,
  "spiral-gasket": spiralGasket,
  lapping,
};

for (const [key, fn] of Object.entries(renderers)) {
  fs.writeFileSync(path.join(outDir, `${key}.svg`), fn());
}
console.log(`${Object.keys(renderers).length} illustrations → public/illustrations/`);
