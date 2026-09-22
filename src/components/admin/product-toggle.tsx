"use client";

import { useOptimistic, useTransition } from "react";
import { toggleProduct } from "@/app/admin/actions";

/** Preline-style switch bound to a product flag. */
export function ProductToggle({ id, field, value }: { id: string; field: "is_published" | "is_featured"; value: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [, start] = useTransition();
  return (
    <label className="relative inline-block h-6 w-11 cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={optimistic}
        aria-label={field === "is_published" ? "Yayında" : "Öne çıkan"}
        onChange={(e) => {
          const next = e.target.checked;
          start(async () => {
            setOptimistic(next);
            await toggleProduct(id, field, next);
          });
        }}
      />
      <span className="absolute inset-0 rounded-full bg-muted transition-colors duration-200 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
      <span className="absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:translate-x-full" />
    </label>
  );
}
