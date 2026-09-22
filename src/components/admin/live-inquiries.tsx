"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Inquiry } from "@/lib/types";

type Toast = { id: string; title: string; body: string };

/**
 * Keeps the admin session fresh and listens for new inquiries via Supabase
 * Realtime while the panel is open: shows an in-page toast, a system
 * notification (if permitted) and refreshes the current view.
 */
export function LiveInquiries() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const supabase = getBrowserClient();
    // Register the service worker early so push subscriptions can be managed from Ayarlar.
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});

    const channel = supabase
      .channel("admin-inquiries")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "inquiries" }, (payload: { new: Record<string, unknown> }) => {
        const i = payload.new as unknown as Inquiry;
        const title = i.kind === "quote" ? "Yeni teklif talebi" : "Yeni iletişim mesajı";
        const body = [i.name, i.company].filter(Boolean).join(" · ");
        setToasts((t) => [...t, { id: i.id, title, body }]);
        router.refresh();
        // With push enabled, the service worker already shows a system notification.
        if (document.visibilityState !== "visible" && "Notification" in window && Notification.permission === "granted") {
          navigator.serviceWorker?.getRegistration().then((reg) => {
            if (!reg) new Notification(title, { body, tag: i.id, icon: "/brand/png/icon-192.png" });
          });
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 end-4 z-[80] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="flex gap-x-3 rounded-xl border border-card-line bg-card p-4 shadow-lg">
          <Bell className="mt-0.5 size-5 shrink-0 text-primary" />
          <Link href={`/admin/talepler/${t.id}`} onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            <p className="truncate text-sm text-muted-foreground-2">{t.body}</p>
          </Link>
          <button type="button" aria-label="Kapat" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="size-6 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground-1 hover:bg-muted-hover">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
