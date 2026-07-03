import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// Simple JWT-free admin session using signed token
export function signAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", process.env.ADMIN_JWT_SECRET ?? "dev-secret")
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
    // Token valid for 8 hours
    if (Date.now() - parseInt(ts) > 8 * 60 * 60 * 1000) return false;
    const expected = createHmac(
      "sha256",
      process.env.ADMIN_JWT_SECRET ?? "dev-secret",
    )
      .update(`${prefix}:${ts}`)
      .digest("hex");
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
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
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
