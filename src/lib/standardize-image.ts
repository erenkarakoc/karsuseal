// Browser-side product photo standardisation (no server image processing on Workers).
// Output: 1600×1200 (4:3), flat white background, no gradient or shadow.

export const STD_W = 1600;
export const STD_H = 1200;
const PAD_X = 96; // breathing room when the photo is centred on the canvas
const PAD_Y = 72;
const MAX_UPSCALE = 2.5;

export type FitMode = "auto" | "contain" | "cover";
export type StandardizeOptions = { trim: boolean; fit: FitMode };
export type StandardizedImage = { blob: Blob; url: string; width: number; height: number; mode: "contain" | "cover"; trimmed: boolean };

export const canStandardize = (file: File) => /^image\/(jpeg|png|webp|avif|gif|bmp)$/.test(file.type);

async function decode(file: File) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Fallback for browsers that cannot decode via createImageBitmap
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    return img;
  }
}

/** Bounding box of the subject: pixels that differ from the (averaged) corner/background colour. */
function findSubject(source: CanvasImageSource, w: number, h: number) {
  const scale = Math.min(1, 700 / Math.max(w, h));
  const sw = Math.max(1, Math.round(w * scale)), sh = Math.max(1, Math.round(h * scale));
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff"; // transparent areas count as background
  ctx.fillRect(0, 0, sw, sh);
  ctx.drawImage(source, 0, 0, sw, sh);
  const { data } = ctx.getImageData(0, 0, sw, sh);
  const px = (x: number, y: number) => { const i = (y * sw + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
  const corners = [px(0, 0), px(sw - 1, 0), px(0, sh - 1), px(sw - 1, sh - 1)];
  const bg = [0, 1, 2].map((k) => corners.reduce((s, c) => s + c[k], 0) / 4);
  const T = 28;
  let minX = sw, minY = sh, maxX = -1, maxY = -1;
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const i = (y * sw + x) * 4;
      if (Math.abs(data[i] - bg[0]) > T || Math.abs(data[i + 1] - bg[1]) > T || Math.abs(data[i + 2] - bg[2]) > T) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null; // blank image
  const m = 0.015; // keep a thin margin around the subject
  const x0 = Math.max(0, (minX / sw - m) * w), y0 = Math.max(0, (minY / sh - m) * h);
  const x1 = Math.min(w, ((maxX + 1) / sw + m) * w), y1 = Math.min(h, ((maxY + 1) / sh + m) * h);
  // ignore trims that would remove less than 3% — not worth it
  if ((x1 - x0) * (y1 - y0) > w * h * 0.97) return null;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

async function toBlob(canvas: HTMLCanvasElement) {
  const webp = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
  if (webp && webp.type === "image/webp") return webp;
  return (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.9)))!;
}

export async function standardizeImage(file: File, opts: StandardizeOptions): Promise<StandardizedImage> {
  const img = await decode(file);
  const iw = "naturalWidth" in img ? img.naturalWidth : img.width;
  const ih = "naturalHeight" in img ? img.naturalHeight : img.height;
  const box = (opts.trim && findSubject(img, iw, ih)) || { x: 0, y: 0, w: iw, h: ih };
  const ratio = box.w / box.h;
  const mode = opts.fit === "auto" ? (Math.abs(ratio - STD_W / STD_H) < 0.12 ? "cover" : "contain") : opts.fit;

  const canvas = document.createElement("canvas");
  canvas.width = STD_W;
  canvas.height = STD_H;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, STD_W, STD_H);

  if (mode === "cover") {
    const s = Math.max(STD_W / box.w, STD_H / box.h);
    const cw = STD_W / s, ch = STD_H / s;
    ctx.drawImage(img, box.x + (box.w - cw) / 2, box.y + (box.h - ch) / 2, cw, ch, 0, 0, STD_W, STD_H);
  } else {
    const s = Math.min((STD_W - PAD_X * 2) / box.w, (STD_H - PAD_Y * 2) / box.h, MAX_UPSCALE);
    const dw = box.w * s, dh = box.h * s;
    ctx.drawImage(img, box.x, box.y, box.w, box.h, (STD_W - dw) / 2, (STD_H - dh) / 2, dw, dh);
  }
  if ("close" in img) img.close();

  const blob = await toBlob(canvas);
  return { blob, url: URL.createObjectURL(blob), width: STD_W, height: STD_H, mode, trimmed: box.w !== iw || box.h !== ih };
}

export async function imageSize(file: File) {
  try {
    const img = await decode(file);
    const size = { width: "naturalWidth" in img ? img.naturalWidth : img.width, height: "naturalHeight" in img ? img.naturalHeight : img.height };
    if ("close" in img) img.close();
    return size;
  } catch {
    return null;
  }
}
