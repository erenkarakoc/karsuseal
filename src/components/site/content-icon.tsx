import {
  BadgeCheck, Clock, Compass, Disc, Droplets, Factory, FileSearch, Flame, FlaskConical, Gauge, Handshake, MapPin, Microscope,
  Package, Pill, Ruler, Scroll, Settings, ShieldCheck, Ship, Shirt, Thermometer, Timer, Truck, UtensilsCrossed, Wheat, Wrench, Zap,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  droplets: Droplets, flask: FlaskConical, utensils: UtensilsCrossed, pill: Pill, scroll: Scroll, shirt: Shirt, flame: Flame,
  zap: Zap, ship: Ship, wheat: Wheat, factory: Factory, wrench: Wrench, disc: Disc, ruler: Ruler, "map-pin": MapPin,
  package: Package, compass: Compass, microscope: Microscope, timer: Timer, shield: ShieldCheck, handshake: Handshake,
  "file-search": FileSearch, clock: Clock, truck: Truck, gauge: Gauge, thermometer: Thermometer, settings: Settings, "badge-check": BadgeCheck,
};

/** Renders an icon chosen in the content editor (see lib/content/icons.ts). */
export function ContentIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Factory;
  return <Icon className={className} />;
}
