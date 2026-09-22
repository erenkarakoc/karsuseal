import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { getCategoryTree, getPublicSettings } from "@/lib/catalog";
import { services } from "@/data/site";

export async function Footer() {
  const [tree, s] = await Promise.all([getCategoryTree(), getPublicSettings()]);
  const tel = s.company_phone?.replace(/[^\d+]/g, "");
  const col = "text-sm text-white/65 hover:text-white focus:outline-hidden focus:text-white";

  return (
    <footer className="mt-auto bg-primary-950 text-white">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" className="h-10 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              Pompa, mikser ve döner ekipmanlar için mekanik salmastra, döner başlık ve sızdırmazlık ürünleri; seçim, tedarik ve revizyon hizmetleri.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {s.company_address && (
                <li className="flex gap-x-3"><MapPin className="size-4 mt-0.5 shrink-0 text-primary-300" />{s.company_address}</li>
              )}
              {s.company_phone && (
                <li><a className="flex gap-x-3 hover:text-white" href={`tel:${tel}`}><Phone className="size-4 mt-0.5 shrink-0 text-primary-300" />{s.company_phone}</a></li>
              )}
              {s.company_email && (
                <li><a className="flex gap-x-3 hover:text-white" href={`mailto:${s.company_email}`}><Mail className="size-4 mt-0.5 shrink-0 text-primary-300" />{s.company_email}</a></li>
              )}
              {s.working_hours && (
                <li className="flex gap-x-3"><Clock className="size-4 mt-0.5 shrink-0 text-primary-300" />{s.working_hours}</li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Ürünler</h4>
              <ul className="mt-4 space-y-2.5">
                {tree.slice(0, 7).map((c) => (
                  <li key={c.id}><Link className={col} href={`/urunler/${c.slug}`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">&nbsp;</h4>
              <ul className="mt-4 space-y-2.5">
                {tree.slice(7).map((c) => (
                  <li key={c.id}><Link className={col} href={`/urunler/${c.slug}`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Kurumsal</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link className={col} href="/kurumsal">Hakkımızda</Link></li>
              <li><Link className={col} href="/hizmetler">Hizmetler</Link></li>
              {services.slice(0, 3).map((sv) => (
                <li key={sv.slug}><Link className={col} href={`/hizmetler#${sv.slug}`}>{sv.title}</Link></li>
              ))}
              <li><Link className={col} href="/sektorler">Sektörler</Link></li>
              <li><Link className={col} href="/iletisim">İletişim</Link></li>
              <li><Link className={col} href="/marka">Marka kiti</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Karsu Seal. Tüm hakları saklıdır.</p>
          <p className="max-w-2xl md:text-end">
            Muadil tip ve pompa uyumluluğunu belirtmek için anılan marka ve model adları ilgili sahiplerine aittir; Karsu Seal bu firmalarla bağlantılı değildir.
          </p>
        </div>
      </div>
    </footer>
  );
}
