import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  outputFileTracingRoot: path.join(__dirname, "../../"),
=======
  outputFileTracingRoot: path.join(__dirname),
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
<<<<<<< HEAD
=======
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
};

export default nextConfig;
