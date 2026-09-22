import Link from "next/link";
import { btn } from "@/components/site/ui";
import { getContent } from "@/lib/content";

/** Closing call-to-action band (text editable in Admin → İçerik → Genel). */
export async function CtaBand() {
  const { ctaBand } = await getContent("genel");
  return (
    <section className="container-page py-16 md:py-20">
      <div className="relative overflow-hidden rounded-2xl bg-primary-950 px-6 py-12 md:px-12 md:py-14 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(91,151,247,0.45),transparent_50%)]" aria-hidden />
        <div className="absolute -end-16 -bottom-24 size-80 rounded-full border-[28px] border-white/5" aria-hidden />
        <div className="relative grid gap-8 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-4xl font-semibold">{ctaBand.title}</h2>
            {ctaBand.text && <p className="mt-3 max-w-xl text-white/70">{ctaBand.text}</p>}
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:justify-end">
            {ctaBand.primary.label && <Link href={ctaBand.primary.href} className={btn.primary + " bg-white! text-[#0B1F3F]! hover:bg-white/90!"}>{ctaBand.primary.label}</Link>}
            {ctaBand.secondary.label && <Link href={ctaBand.secondary.href} className={btn.ghostLight}>{ctaBand.secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
