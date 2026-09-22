import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, Menu, Moon, Phone, Search, Sun, X, Clock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { QuoteBadge } from "@/components/site/quote-cart";
import { getCategoryTree, getPublicSettings } from "@/lib/catalog";
import { getContent } from "@/lib/content";

const navLink =
  "py-2 md:py-0 flex items-center gap-x-1.5 font-medium text-[15px] text-navbar-nav-foreground hover:text-primary focus:outline-hidden focus:text-primary";

export async function Header() {
  const [tree, settings, { items: industries }, general] = await Promise.all([getCategoryTree(), getPublicSettings(), getContent("sektorler"), getContent("genel")]);
  const tel = settings.company_phone?.replace(/[^\d+]/g, "");

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden md:block bg-primary-950 text-white/80 text-[13px]">
        <div className="container-page flex h-9 items-center justify-between gap-x-6">
          {settings.working_hours ? (
            <p className="flex items-center gap-x-2">
              <Clock className="size-3.5" />
              {settings.working_hours}
            </p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-x-6">
            {settings.company_phone && (
              <a href={`tel:${tel}`} className="flex items-center gap-x-2 hover:text-white">
                <Phone className="size-3.5" /> {settings.company_phone}
              </a>
            )}
            {settings.company_email && (
              <a href={`mailto:${settings.company_email}`} className="flex items-center gap-x-2 hover:text-white">
                <Mail className="size-3.5" /> {settings.company_email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-navbar/95 backdrop-blur-md border-b border-navbar-line">
        <nav className="relative container-page flex flex-wrap md:flex-nowrap items-center justify-between gap-x-6 py-3 md:py-0 md:h-[72px]">
          <Link href="/" className="flex-none rounded-md focus:outline-hidden focus:opacity-80" aria-label="Karsu Seal ana sayfa">
            <Logo className="h-9 md:h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-x-1 md:order-3">
            <Link href="/arama" aria-label="Ürün ara" className="inline-flex size-10 items-center justify-center rounded-lg text-navbar-nav-foreground hover:bg-navbar-nav-hover focus:outline-hidden focus:bg-navbar-nav-focus">
              <Search className="size-5" />
            </Link>
            <QuoteBadge />
            <button type="button" className="hs-dark-mode hs-dark-mode-active:hidden inline-flex size-10 items-center justify-center rounded-lg text-navbar-nav-foreground hover:bg-navbar-nav-hover focus:outline-hidden" data-hs-theme-click-value="dark" aria-label="Koyu tema">
              <Moon className="size-5" />
            </button>
            <button type="button" className="hs-dark-mode hidden hs-dark-mode-active:inline-flex size-10 items-center justify-center rounded-lg text-navbar-nav-foreground hover:bg-navbar-nav-hover focus:outline-hidden" data-hs-theme-click-value="light" aria-label="Açık tema">
              <Sun className="size-5" />
            </button>
            <Link href="/teklif-al" className="hidden lg:inline-flex ms-2 py-2.5 px-4 items-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus">
              Teklif Al <ArrowRight className="size-4" />
            </Link>
            <button
              type="button"
              className="hs-collapse-toggle md:hidden inline-flex size-10 items-center justify-center rounded-lg border border-layer-line text-layer-foreground hover:bg-layer-hover focus:outline-hidden"
              id="main-nav-toggle"
              aria-expanded="false"
              aria-controls="main-nav"
              aria-label="Menüyü aç/kapat"
              data-hs-collapse="#main-nav"
            >
              <Menu className="hs-collapse-open:hidden size-5" />
              <X className="hs-collapse-open:block hidden size-5" />
            </button>
          </div>

          <div id="main-nav" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:basis-auto md:order-2" aria-labelledby="main-nav-toggle">
            <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden md:max-h-none md:overflow-visible flex flex-col md:flex-row md:items-center md:justify-center gap-y-1 gap-x-7 py-3 md:py-0 md:h-[72px]">
              {/* Products mega menu */}
              <div className="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] [--is-collapse:true] md:[--is-collapse:false] md:static md:h-full md:flex md:items-center">
                <button type="button" className={`hs-dropdown-toggle w-full md:w-auto justify-between ${navLink}`} aria-haspopup="menu" aria-expanded="false" aria-label="Ürünler">
                  Ürünler
                  <ChevronDown className="hs-dropdown-open:-rotate-180 duration-300 shrink-0 size-4" />
                </button>
                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-150 hs-dropdown-open:opacity-100 opacity-0 relative w-full min-w-60 hidden z-10 md:absolute md:top-full md:start-0 md:mt-0 md:border-t md:border-navbar-line md:bg-dropdown md:shadow-xl before:absolute before:-top-4 before:start-0 before:w-full before:h-4"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="main-nav-toggle"
                >
                  <div className="md:container-page md:py-8 grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                      {tree.map((c) => (
                        <div key={c.id} className="py-1">
                          <Link href={`/urunler/${c.slug}`} className="group block rounded-lg p-2 -mx-2 hover:bg-dropdown-item-hover focus:outline-hidden focus:bg-dropdown-item-focus">
                            <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{c.name}</span>
                            <span className="hidden md:block mt-0.5 text-[13px] leading-snug text-muted-foreground-1 line-clamp-2">{c.summary}</span>
                          </Link>
                          {c.children.length > 0 && (
                            <ul className="mt-1 ms-2 border-s border-line-2 ps-3 space-y-1">
                              {c.children.map((ch) => (
                                <li key={ch.id}>
                                  <Link href={`/urunler/${ch.slug}`} className="text-[13px] text-muted-foreground-2 hover:text-primary">
                                    {ch.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="hidden md:flex md:col-span-3 flex-col justify-between rounded-xl bg-primary-950 p-6 text-white bg-[radial-gradient(circle_at_80%_0%,rgba(91,151,247,0.35),transparent_55%)]">
                      <div>
                        <p className="font-display text-xl font-semibold leading-tight">{general.megaMenu.title}</p>
                        <p className="mt-2 text-sm text-white/70">{general.megaMenu.text}</p>
                      </div>
                      <div className="mt-6 flex flex-col gap-2">
                        <Link href="/urunler" className="inline-flex items-center gap-x-2 text-sm font-semibold hover:underline">
                          Tüm ürün kataloğu <ArrowRight className="size-4" />
                        </Link>
                        <Link href="/teklif-al" className="inline-flex items-center gap-x-2 text-sm font-semibold hover:underline">
                          Teknik teklif iste <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Industries dropdown */}
              <div className="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] [--is-collapse:true] md:[--is-collapse:false] md:h-full md:flex md:items-center">
                <button type="button" className={`hs-dropdown-toggle w-full md:w-auto justify-between ${navLink}`} aria-haspopup="menu" aria-expanded="false" aria-label="Sektörler">
                  Sektörler
                  <ChevronDown className="hs-dropdown-open:-rotate-180 duration-300 shrink-0 size-4" />
                </button>
                <div className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-150 hs-dropdown-open:opacity-100 opacity-0 relative w-full md:w-64 hidden z-10 md:absolute md:top-full md:mt-0 md:bg-dropdown md:border md:border-dropdown-line md:rounded-xl md:shadow-xl md:p-2 before:absolute before:-top-4 before:start-0 before:w-full before:h-4" role="menu" aria-orientation="vertical">
                  <div className="py-1 md:py-0 ms-2 md:ms-0 border-s md:border-0 border-line-2 ps-3 md:ps-0">
                    {industries.map((i) => (
                      <Link key={i.slug} href={`/sektorler/${i.slug}`} className="flex rounded-lg py-2 md:px-3 text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:outline-hidden focus:bg-dropdown-item-focus">
                        {i.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/hizmetler" className={navLink}>Hizmetler</Link>
              <Link href="/kurumsal" className={navLink}>Kurumsal</Link>
              <Link href="/iletisim" className={navLink}>İletişim</Link>
              <Link href="/teklif-al" className="md:hidden mt-2 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover">
                Teklif Al <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
