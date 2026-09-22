import { AdminList, SettingsForm } from "@/components/admin/settings-forms";
import { PushManager } from "@/components/admin/push-manager";
import { Card, formatDate, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Settings } from "@/lib/types";

export const metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const { supabase, user } = await requireAdmin();
  const [{ data: settings }, { data: admins }, { data: devices }] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).single(),
    supabase.from("admin_users").select("email, created_at").order("created_at"),
    supabase.from("push_subscriptions").select("id, user_email, user_agent, created_at").order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <PageTitle title="Ayarlar" description="Bildirimler, iletişim bilgileri ve yöneticiler" />
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <h2 className="font-display font-semibold text-foreground">Tarayıcı bildirimleri</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground-1">Yeni teklif ve iletişim talepleri, bildirimleri açtığınız her cihaza anında iletilir (tarayıcı kapalıyken de).</p>
          <PushManager />
          {devices && devices.length > 0 && (
            <div className="mt-6 border-t border-card-divider pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-1">Kayıtlı cihazlar ({devices.length})</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground-2">
                {devices.map((d) => <li key={d.id} className="truncate">{d.user_email} · {formatDate(d.created_at)} · {d.user_agent}</li>)}
              </ul>
            </div>
          )}
        </Card>

        <SettingsForm settings={settings as Settings} />

        <Card className="p-5 sm:p-6">
          <h2 className="font-display font-semibold text-foreground">Yöneticiler</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground-1">Eklenen e-posta adresine davet gönderilir; kişi şifresini belirleyerek panele giriş yapabilir.</p>
          <AdminList admins={admins ?? []} currentEmail={user.email ?? ""} />
        </Card>
      </div>
    </>
  );
}
