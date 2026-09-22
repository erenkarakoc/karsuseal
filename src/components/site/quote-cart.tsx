"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Check, ClipboardList, Plus } from "lucide-react";
import type { QuoteItem } from "@/lib/types";

const KEY = "karsu_quote_v1";
const EVENT = "karsu-quote-change";
const EMPTY: QuoteItem[] = [];

let cache: { raw: string | null; items: QuoteItem[] } = { raw: null, items: EMPTY };

function read(): QuoteItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.items;
  let items: QuoteItem[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed;
  } catch {}
  cache = { raw, items };
  return items;
}

function write(items: QuoteItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useQuoteCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    items,
    count: items.reduce((n, i) => n + (i.quantity || 1), 0),
    add(item: Omit<QuoteItem, "quantity"> & { quantity?: number }) {
      const current = read();
      const idx = current.findIndex((i) => i.code === item.code);
      if (idx >= 0) {
        write(current.map((i, n) => (n === idx ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i)));
      } else {
        write([...current, { ...item, quantity: item.quantity ?? 1 }]);
      }
    },
    /** Adds the item only if it is not in the list yet (reads fresh storage, safe to call repeatedly). */
    ensure(item: Omit<QuoteItem, "quantity">) {
      const current = read();
      if (!current.some((i) => i.code === item.code)) write([...current, { ...item, quantity: 1 }]);
    },
    update(code: string, patch: Partial<QuoteItem>) {
      write(read().map((i) => (i.code === code ? { ...i, ...patch } : i)));
    },
    remove(code: string) {
      write(read().filter((i) => i.code !== code));
    },
    clear() {
      write([]);
    },
    has: (code: string) => items.some((i) => i.code === code),
  };
}

export function QuoteBadge({ className = "" }: { className?: string }) {
  const { count } = useQuoteCart();
  return (
    <Link
      href="/teklif-al"
      className={`relative inline-flex size-10 items-center justify-center rounded-lg text-navbar-nav-foreground hover:bg-navbar-nav-hover focus:outline-hidden focus:bg-navbar-nav-focus ${className}`}
      aria-label={`Teklif listesi (${count} ürün)`}
    >
      <ClipboardList className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

export function AddToQuoteButton({ item, className = "", size = "md" }: { item: Omit<QuoteItem, "quantity">; className?: string; size?: "sm" | "md" }) {
  const cart = useQuoteCart();
  const added = cart.has(item.code);
  const pad = size === "sm" ? "py-2 px-3 text-sm" : "py-3 px-4 text-sm";
  if (added) {
    return (
      <Link
        href="/teklif-al"
        className={`inline-flex items-center justify-center gap-x-2 font-medium rounded-lg border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 focus:outline-hidden dark:border-primary-800 dark:bg-primary-900/40 dark:text-primary-200 ${pad} ${className}`}
      >
        <Check className="size-4" /> Teklif listesinde · Görüntüle
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => cart.add(item)}
      className={`inline-flex items-center justify-center gap-x-2 font-medium rounded-lg border border-layer-line bg-layer text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus ${pad} ${className}`}
    >
      <Plus className="size-4" /> Teklif listesine ekle
    </button>
  );
}
