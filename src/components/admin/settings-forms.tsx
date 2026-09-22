"use client";

import { useActionState, useState, useTransition } from "react";
import { LoaderCircle, Save, UserPlus, X } from "lucide-react";
import { inviteAdmin, removeAdmin, saveSettings, updatePassword, type ActionResult } from "@/app/admin/actions";
import { adminBtn, Card, ResultNote } from "@/components/admin/ui";
import { inputCls } from "@/components/site/forms";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [result, action, pending] = useActionState(saveSettings, null);
  const field = (name: keyof Settings, label: string, placeholder?: string) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <input id={name} name={name} defaultValue={(settings[name] as string) ?? ""} placeholder={placeholder} className={inputCls} />
    </div>
  );
  return (
    <form action={action}>
      <Card className="p-5 sm:p-6">
        <h2 className="font-display font-semibold text-foreground">E-posta bildirimleri</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground-1">Her yeni talepte aşağıdaki adreslere özet e-posta gönderilir.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="notification_emails" className="mb-2 block text-sm font-medium text-foreground">Alıcılar (her satıra bir adres)</label>
            <textarea id="notification_emails" name="notification_emails" rows={4} defaultValue={settings.notification_emails.join("\n")} className={inputCls} placeholder="satis@karsuseal.com" />
          </div>
          <div className="space-y-3 pt-7">
            <label className="flex items-center gap-x-3 text-sm text-foreground">
              <input type="checkbox" name="email_notifications" defaultChecked={settings.email_notifications} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" /> E-posta bildirimleri açık
            </label>
            <label className="flex items-center gap-x-3 text-sm text-foreground">
              <input type="checkbox" name="push_notifications" defaultChecked={settings.push_notifications} className="size-4 rounded-sm border-line-3 text-primary focus:ring-primary" /> Tarayıcı bildirimleri açık
            </label>
          </div>
        </div>

        <h2 className="mt-8 border-t border-card-divider pt-6 font-display font-semibold text-foreground">Sitede görünen iletişim bilgileri</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {field("company_phone", "Telefon", "+90 212 000 00 00")}
          {field("company_whatsapp", "WhatsApp", "+90 5xx xxx xx xx")}
          {field("company_email", "E-posta", "info@karsuseal.com")}
          {field("working_hours", "Çalışma saatleri", "Hafta içi 08:30 – 18:00")}
          <div className="md:col-span-2">{field("company_address", "Adres")}</div>
          <div className="md:col-span-2">{field("company_maps_url", "Harita bağlantısı (Google Maps)")}</div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button disabled={pending} className={adminBtn.primary}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Kaydet</button>
          <ResultNote result={result} />
        </div>
      </Card>
    </form>
  );
}

export function AdminList({ admins, currentEmail }: { admins: { email: string; created_at: string }[]; currentEmail: string }) {
  const [result, action, pending] = useActionState(inviteAdmin, null);
  const [removeResult, setRemoveResult] = useState<ActionResult | null>(null);
  const [removing, start] = useTransition();
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-card-divider rounded-lg border border-card-line">
        {admins.map((a) => (
          <li key={a.email} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span className="truncate text-foreground">{a.email}{a.email === currentEmail.toLowerCase() && <span className="ms-2 text-xs text-muted-foreground-1">(siz)</span>}</span>
            {a.email !== currentEmail.toLowerCase() && (
              <button type="button" disabled={removing} aria-label={`${a.email} yetkisini kaldır`} onClick={() => confirm(`${a.email} yönetici yetkisi kaldırılsın mı?`) && start(async () => setRemoveResult(await removeAdmin(a.email)))} className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground-1 hover:bg-red-50 hover:text-red-600">
                <X className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <form action={action} className="flex flex-col gap-2 sm:flex-row">
        <input name="email" type="email" required placeholder="yeni.yonetici@karsuseal.com" className={inputCls} aria-label="Yönetici e-postası" />
        <button disabled={pending} className={`${adminBtn.secondary} shrink-0`}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />} Davet et</button>
      </form>
      <ResultNote result={removeResult ?? result} />
    </div>
  );
}

export function PasswordForm() {
  const [result, action, pending] = useActionState(updatePassword, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">Yeni şifre</label>
        <input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password2" className="mb-2 block text-sm font-medium text-foreground">Yeni şifre (tekrar)</label>
        <input id="password2" name="password2" type="password" minLength={8} autoComplete="new-password" required className={inputCls} />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className={adminBtn.primary}>{pending && <LoaderCircle className="size-4 animate-spin" />} Şifreyi kaydet</button>
        <ResultNote result={result} />
      </div>
    </form>
  );
}
