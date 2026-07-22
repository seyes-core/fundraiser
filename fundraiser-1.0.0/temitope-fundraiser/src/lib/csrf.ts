import { NextRequest } from "next/server";

/**
 * SECURITY_AUDIT.md Finding 014: defense-in-depth CSRF mitigation for
 * state-changing admin routes. `SameSite=Strict` on the `admin_token`
 * cookie already blocks the cookie from being sent on cross-site
 * requests in modern browsers, but this adds an explicit `Origin` check
 * so the protection isn't solely dependent on SameSite being honored by
 * every client.
 *
 * Only used on routes that already require `isAdminAuthenticated()` —
 * this is a secondary check, not a replacement for auth.
 */
export function verifyAdminOrigin(req: NextRequest): boolean {
  const allowed = process.env.NEXT_PUBLIC_SITE_URL;
  if (!allowed) {
    // No configured site URL to compare against — don't block requests in
    // local/dev environments where this env var is commonly unset.
    return true;
  }

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(allowed).origin;
  } catch {
    return true;
  }

  const origin = req.headers.get("origin");
  if (origin) {
    return origin === allowedOrigin;
  }

  // Some same-origin requests (e.g. simple GETs, or older browsers) omit
  // the Origin header — fall back to Referer.
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === allowedOrigin;
    } catch {
      return false;
    }
  }

  // Neither header present: reject state-changing requests to be safe.
  return false;
}
