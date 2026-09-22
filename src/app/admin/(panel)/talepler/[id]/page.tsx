import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { InquiryEditor } from "@/components/admin/inquiry-editor";
import { adminBtn, Card, formatDate, KindBadge, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Inquiry } from "@/lib/types";

export const metadata = { title: "Talep detayı" };

const DETAIL_LABELS: Record<string, string> = {
  medium: "Akışkan", temperature: "Sıcaklık", pressure: "Basınç", speed: "Devir", shaft: "Mil çapı", equipment: "Pompa / ekipman",
};

type Props = { params: Promise<{ id: string }> };

export default async function InquiryPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const i = data as Inquiry;
  // Opening a new inquiry marks it as being handled.
  if (i.status === "new") {
    await supabase.from("inquiries").update({ status: "in_progress" }).eq("id", id);
    i.status = "in_progress";
  }
  const subject = encodeURIComponent(`Re: ${i.subject ?? (i.kind === "quote" ? "Teklif talebiniz" : "Mesajınız")} — Karsu Seal`);
  const details = Object.entries(i.details ?? {}).filter(([, v]) => v);

  return (
    <>
      <Link href="/admin/talepler" className="mb-4 inline-flex items-center gap-x-1.5 text-sm text-muted-foreground-1 hover:text-foreground"><ArrowLeft className="size-4" /> Talepler</Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><KindBadge kind={i.kind} /><StatusBadge status={i.status} /></div>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">{i.subject || (i.kind === "quote" ? "Teklif talebi" : "İletişim mesajı")}</h1>
          <p className="mt-1 text-sm text-muted-foreground-1">{formatDate(i.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <a href={`mailto:${i.email}?subject=${subject}`} className={adminBtn.primary}><Mail className="size-4" /> Yanıtla</a>
          {i.phone && <a href={`tel:${i.phone.replace(/[^\d+]/g, "")}`} className={adminBtn.secondary}><Phone className="size-4" /> Ara</a>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {i.items.length > 0 && (
            <Card className="overflow-hidden">
              <h2 className="border-b border-card-divider px-5 py-3 font-display font-semibold text-foreground">Ürünler</h2>
              <table className="min-w-full divide-y divide-card-divider text-sm">
                <tbody className="divide-y divide-card-divider">
                  {i.items.map((it, n) => (
                    <tr key={n}>
                      <td className="px-5 py-3">
                        {it.slug ? <Link href={`/urun/${it.slug}`} target="_blank" className="font-mono text-xs font-semibold text-primary hover:underline">{it.code}</Link> : <span className="font-mono text-xs font-semibold text-primary">{it.code}</span>}
                        <p className="text-foreground">{it.name.replace(`${it.code} `, "")}</p>
                        {it.note && <p className="mt-0.5 text-xs text-muted-foreground-1">Not: {it.note}</p>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-end font-semibold text-foreground">{it.quantity} adet</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {details.length > 0 && (
            <Card className="p-5">
              <h2 className="font-display font-semibold text-foreground">Çalışma koşulları</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                {details.map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-muted-foreground-1">{DETAIL_LABELS[k] ?? k}</dt><dd className="text-sm font-medium text-foreground">{v}</dd></div>
                ))}
              </dl>
            </Card>
          )}

          {i.message && (
            <Card className="p-5">
              <h2 className="font-display font-semibold text-foreground">Mesaj</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{i.message}</p>
            </Card>
          )}

          <InquiryEditor id={i.id} status={i.status} notes={i.admin_notes} />
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-display font-semibold text-foreground">İletişim</h2>
            <dl className="mt-3 space-y-3 text-sm">
              {[
                ["Ad soyad", i.name],
                ["Firma", i.company],
                ["E-posta", i.email],
                ["Telefon", i.phone],
                ["Şehir", i.city],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted-foreground-1">{k}</dt><dd className="break-words font-medium text-foreground">{v}</dd></div>
              ))}
            </dl>
          </Card>
          <Card className="p-5 text-xs text-muted-foreground-1 space-y-2">
            {i.source_url && <p className="break-all">Kaynak: {i.source_url}</p>}
            {i.user_agent && <p className="break-all">Tarayıcı: {i.user_agent}</p>}
            <p>Kayıt no: {i.id}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
