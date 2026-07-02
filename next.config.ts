import type { NextConfig } from "next";

/**
 * Next.js config for OpenCalc.
 *
 * BUILD_TARGET env var switches between two output modes:
 *
 *  - "standalone" (default): produces .next/standalone/server.js —
 *    a Node.js server. Used by the Z.ai sandbox + Netlify preview.
 *
 *  - "android": produces ./out/ — a fully static export. Used by the
 *    Capacitor Android build (WebViews can't run Node.js).
 *
 * The GitHub Actions workflow at .github/workflows/build-apk.yml
 * sets BUILD_TARGET=android before running `next build`.
 */
const isAndroid = process.env.BUILD_TARGET === "android";

const nextConfig: NextConfig = {
  output: isAndroid ? "export" : "standalone",
  // Static export requires unoptimized images (no server-side loader)
  images: { unoptimized: isAndroid },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
