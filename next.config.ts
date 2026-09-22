import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no built-in Next image optimizer; product images are
  // SVGs or already-optimised uploads served from Supabase Storage.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;

// Makes Cloudflare bindings available to `next dev`.
initOpenNextCloudflareForDev();
