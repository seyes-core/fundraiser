import { NextResponse } from "next/server";

/**
 * SECURITY_AUDIT.md Finding 009 / 019: there was previously no way to
 * invalidate the `admin_token` cookie. On a shared or stolen device, the
 * session remained valid for up to 8 hours with no revocation mechanism.
 * This clears the cookie client-side; combined with a logout button in the
 * dashboard, an admin can now end their session on demand.
 *
 * Note: because tokens are stateless HMAC-signed values (no server-side
 * session store), this cannot forcibly invalidate a copy of the token an
 * attacker may already have exfiltrated — only the current browser's
 * cookie. See SECURITY_FIXES.md for the accepted-risk note on true
 * server-side revocation (would require Redis-backed token IDs).
 */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return res;
}
