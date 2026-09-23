import { getPublicSettings } from "@/lib/catalog";
import { getContent } from "@/lib/content";

/**
 * Floating WhatsApp button, bottom-left on every public page.
 * Number: Ayarlar → WhatsApp. Visibility, label and prefilled message: İçerik → Genel.
 */
export async function WhatsAppButton() {
  const [settings, { whatsapp }] = await Promise.all([getPublicSettings(), getContent("genel")]);
  const number = settings.company_whatsapp?.replace(/\D/g, "");
  if (!whatsapp.enabled || !number) return null;

  const href = `https://wa.me/${number}${whatsapp.message ? `?text=${encodeURIComponent(whatsapp.message)}` : ""}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.label || "WhatsApp"}
      className="group fixed bottom-4 start-4 z-40 inline-flex items-center gap-x-2 rounded-full bg-[#25D366] py-3 ps-3 pe-3 text-white shadow-lg shadow-black/20 transition hover:bg-[#1FB855] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366] sm:bottom-6 sm:start-6 md:pe-5"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0 fill-current">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2.1 22l5.33-1.38a9.83 9.83 0 0 0 4.6 1.17h.01c5.44 0 9.86-4.42 9.86-9.86 0-2.63-1.03-5.11-2.89-6.97A9.79 9.79 0 0 0 12.04 2zm0 17.96h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.16.82.85-3.08-.2-.32a8.17 8.17 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.21-8.2a8.14 8.14 0 0 1 5.79 2.4 8.13 8.13 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2z" />
      </svg>
      {whatsapp.label && <span className="hidden text-sm font-semibold md:inline">{whatsapp.label}</span>}
    </a>
  );
}
