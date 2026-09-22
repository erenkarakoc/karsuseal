"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** (Re)initialises Preline's vanilla JS plugins after every client-side navigation. */
export default function PrelineScript() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    import("preline/non-auto").then(({ HSStaticMethods }) => {
      if (cancelled) return;
      HSStaticMethods.cleanCollection();
      HSStaticMethods.autoInit();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}

/** Call after rendering Preline markup dynamically (e.g. inside a client component). */
export async function reinitPreline(collection?: string | string[]) {
  const { HSStaticMethods } = await import("preline/non-auto");
  HSStaticMethods.autoInit(collection as never);
}
