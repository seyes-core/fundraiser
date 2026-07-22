import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * SECURITY_AUDIT.md Finding 015: fail fast instead of silently falling back
 * to a hardcoded, publicly-known secret. If this throws, it throws at
 * module load / first use — loudly, in logs/build output — rather than
 * quietly accepting forged tokens signed with `"dev-secret"`.
 */
function getAdminJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_JWT_SECRET environment variable is required and must not be empty.",
    );
  }
  return secret;
}

// Simple JWT-free admin session using signed token
export function signAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", getAdminJwtSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [prefix, ts, sig] = parts;
    if (prefix !== "admin") return false;

    /**
     * SECURITY_AUDIT.md Finding 003: `parseInt("")` (or any non-numeric
     * timestamp) returns NaN, and `NaN > 28800000` is `false` — so the old
     * expiry check silently PASSED for a malformed/empty timestamp,
     * producing a token that never expires. Guard explicitly against NaN
     * before comparing.
     */
    const tsNum = parseInt(ts, 10);
    if (!Number.isFinite(tsNum)) return false;

    // Token valid for 8 hours
    if (Date.now() - tsNum > 8 * 60 * 60 * 1000) return false;

    const expected = createHmac("sha256", getAdminJwtSecret())
      .update(`${prefix}:${ts}`)
      .digest("hex");

    // Guard against length mismatch before timingSafeEqual (it throws on
    // unequal-length buffers rather than returning false).
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return false;

    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function getAdminToken(req: NextRequest): string | null {
  return req.cookies.get("admin_token")?.value ?? null;
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const token = getAdminToken(req);
  return token ? verifyAdminToken(token) : false;
}

export function verifyFlutterwaveWebhook(signature: string): boolean {
  const expected = process.env.FLUTTERWAVE_SECRET_HASH ?? "";
  if (!signature || !expected) return false;
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(sigBuf, expectedBuf);
}
