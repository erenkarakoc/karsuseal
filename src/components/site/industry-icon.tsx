import { Droplets, Factory, FlaskConical, Flame, Pill, Scroll, Ship, Shirt, Wheat, Zap, UtensilsCrossed } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "su-ve-atik-su": Droplets,
  "kimya-ve-petrokimya": FlaskConical,
  "gida-ve-icecek": UtensilsCrossed,
  ilac: Pill,
  "kagit-ve-seluloz": Scroll,
  tekstil: Shirt,
  "demir-celik": Flame,
  enerji: Zap,
  denizcilik: Ship,
  seker: Wheat,
};

export function IndustryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? Factory;
  return <Icon className={className} />;
}
