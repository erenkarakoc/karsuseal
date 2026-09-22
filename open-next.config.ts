import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Pages read the catalog from Supabase at request time, so no incremental cache
// (R2/KV) is required. Add one here if you later enable ISR.
export default defineCloudflareConfig({});
