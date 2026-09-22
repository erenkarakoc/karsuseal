/** Public URL for a product/category image, falling back to the standard illustration. */
export function imageFor(item: { image_url: string | null; illustration: string | null }) {
  return item.image_url || `/illustrations/${item.illustration || "seal-multispring"}.svg`;
}

export const ILLUSTRATIONS = [
  "seal-conical", "seal-multispring", "seal-double", "seal-elastomer-bellows", "seal-metal-bellows",
  "seal-cartridge", "seal-cartridge-double", "seal-split", "seal-agitator", "rotary-joint", "rotary-joint-double",
  "swivel-joint", "seal-support-vessel", "packing-ptfe", "packing-graphite-ptfe", "packing-synthetic", "packing-ramie",
  "packing-aramid", "packing-zebra", "packing-graphite", "packing-graphite-wire", "packing-glass", "o-ring-nbr",
  "o-ring-fkm", "o-ring-epdm", "o-ring-vmq", "o-ring-ffkm", "o-ring-fep", "seal-face-carbon", "seal-face-sic",
  "seal-face-tc", "seal-face-ceramic", "ptfe", "gasket-sheet", "rubber-sheet", "spiral-gasket", "lapping",
] as const;
