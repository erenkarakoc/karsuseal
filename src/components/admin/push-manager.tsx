"use client";

import { useEffect, useState, useTransition } from "react";
import { BellOff, BellRing, LoaderCircle, Mail, Send } from "lucide-react";
import { removePushSubscription, savePushSubscription, sendTestEmail, sendTestPush, type ActionResult } from "@/app/admin/actions";
import { adminBtn, ResultNote } from "@/components/admin/ui";
import { VAPID_PUBLIC_KEY } from "@/lib/env";

type State = "loading" | "unsupported" | "denied" | "off" | "on";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/** Enables/disables browser push notifications for the current device. */
export function PushManager() {
  const [state, setState] = useState<State>("loading");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !VAPID_PUBLIC_KEY) return setState("unsupported");
      if (Notification.permission === "denied") return setState("denied");
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, []);

  const enable = () =>
    start(async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
      const res = await savePushSubscription(sub.toJSON(), navigator.userAgent);
      setResult(res.ok ? { ok: true, message: "Bu cihazda bildirimler açıldı." } : res);
      if (res.ok) setState("on");
    });

  const disable = () =>
    start(async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
      setResult({ ok: true, message: "Bu cihazda bildirimler kapatıldı." });
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {state === "loading" && <LoaderCircle className="size-5 animate-spin text-muted-foreground" />}
        {state === "unsupported" && (
          <p className="text-sm text-muted-foreground-2">
            {VAPID_PUBLIC_KEY ? "Bu tarayıcı bildirimleri desteklemiyor. (iOS'ta siteyi ana ekrana ekleyip oradan açın.)" : "VAPID anahtarı tanımlı değil — README'deki “Bildirimler” adımını uygulayın."}
          </p>
        )}
        {state === "denied" && <p className="text-sm text-red-600">Bildirim izni tarayıcı ayarlarından engellenmiş. Site ayarlarından izin verip sayfayı yenileyin.</p>}
        {state === "off" && (
          <button type="button" onClick={enable} disabled={pending} className={adminBtn.primary}>
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <BellRing className="size-4" />} Bu cihazda bildirimleri aç
          </button>
        )}
        {state === "on" && (
          <>
            <span className="inline-flex items-center gap-x-2 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/40 dark:text-teal-200"><BellRing className="size-4" /> Bu cihazda açık</span>
            <button type="button" onClick={disable} disabled={pending} className={adminBtn.secondary}><BellOff className="size-4" /> Kapat</button>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={() => start(async () => setResult(await sendTestPush()))} className={adminBtn.secondary}><Send className="size-4" /> Test bildirimi</button>
        <button type="button" disabled={pending} onClick={() => start(async () => setResult(await sendTestEmail()))} className={adminBtn.secondary}><Mail className="size-4" /> Test e-postası</button>
      </div>
      <ResultNote result={result} />
    </div>
  );
}
