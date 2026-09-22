const TR_MAP: Record<string, string> = { ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" };

/** Turkish-aware URL slug: "KS-M7 Çok Yaylı" → "ks-m7-cok-yayli" */
export function slugify(text: string) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[ığüşöç]/g, (c) => TR_MAP[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
