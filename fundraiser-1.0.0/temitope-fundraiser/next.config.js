/** @type {import('next').NextConfig} */

/**
 * SECURITY_AUDIT.md Finding 007 / 016: the app previously set only
 * X-Content-Type-Options / X-Frame-Options / X-XSS-Protection, and only on
 * /api/*. There was no Content-Security-Policy (the single most effective
 * blast-radius limiter against any XSS, present or future) and no HSTS
 * header, so browsers never learned to force HTTPS on repeat visits.
 *
 * These headers now apply to every route, not just the API.
 *
 * Note: this project also had a `next.config.ts` that duplicated (and had
 * drifted from) this file. Next.js 14 does not support `next.config.ts` at
 * all — it silently ignored that file and always ran on this one — so the
 * `.ts` copy was dead code. It has been removed to avoid the two ever
 * diverging again.
 */
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required for Next.js's inline bootstrap scripts;
  // tighten to a nonce/hash-based policy in a follow-up.
  "script-src 'self' 'unsafe-inline' https://checkout.flutterwave.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://avatars.githubusercontent.com https://github.com",
  "connect-src 'self' https://*.supabase.co https://api.flutterwave.com",
  "frame-src https://checkout.flutterwave.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
