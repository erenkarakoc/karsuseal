import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT, HOME_SECTIONS, type ContentKey, type ContentMap } from "./defaults";
import { mergeContent } from "./merge";

export { mergeContent };

const loadAll = cache(async (): Promise<Partial<Record<ContentKey, unknown>>> => {
  if (!isSupabaseConfigured()) return {};
  const { data, error } = await createPublicClient().from("site_content").select("key, content");
  if (error) {
    // Table not migrated yet: render defaults rather than failing the page.
    console.error("[content]", error.message);
    return {};
  }
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.content]));
});

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const stored = (await loadAll())[key];
  const merged = mergeContent(DEFAULT_CONTENT[key], stored);
  if (key === "ana-sayfa") {
    // Keep every known section in the order list (new sections appear at the end).
    const home = merged as ContentMap["ana-sayfa"];
    const order = home.order.filter((s) => (HOME_SECTIONS as readonly string[]).includes(s));
    for (const s of HOME_SECTIONS) if (!order.includes(s)) order.push(s);
    return { ...home, order } as ContentMap[K];
  }
  return merged;
}
