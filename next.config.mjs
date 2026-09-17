/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' " +
              (process.env.NODE_ENV === "development"
                ? "'unsafe-eval'; "
                : "; ") +
              "style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' " +
              (process.env.NODE_ENV === "development"
                ? "ws:; "
                : "wss:; upgrade-insecure-requests; ") +
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: false },
      ...["terms", "privacy", "cookies", "affiliate", "admin"].map((name) => ({
        source: "/" + name + ".html",
        destination: "/" + name,
        permanent: false,
      })),
      {
        source: "/affiliate-dashboard.html",
        destination: "/affiliate/dashboard",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
