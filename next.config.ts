import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Product covers from Teachers Pay Teachers (see src/lib/tpt.ts).
    remotePatterns: [{ protocol: "https", hostname: "ecdn.teacherspayteachers.com", pathname: "/thumbitem/**" }],
  },
  // The PDF library runs as plain Node.js code rather than being bundled.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Files the PDF download reads from disk, so they're included when deployed.
  outputFileTracingIncludes: {
    "/worksheets/[id]/pdf": ["./src/assets/fonts/*", "./public/brand/logo-horizontal.png"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
