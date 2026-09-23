import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no built-in Next image optimizer; product images are
  // SVGs or already-optimised uploads served from Supabase Storage.
  images: { unoptimized: true },
  poweredByHeader: false,
  // The dev overlay sits bottom-left by default, right on top of the WhatsApp button.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;

// Makes Cloudflare bindings available to `next dev`.
initOpenNextCloudflareForDev();
