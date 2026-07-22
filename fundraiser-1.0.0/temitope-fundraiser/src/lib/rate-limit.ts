/**
 * Rate limiter — SECURITY_AUDIT.md Finding 001 / 011 / 018.
 *
 * The previous implementation stored counters in a module-scope `Map`.
 * On Vercel (and any serverless platform) each route runs in its own
 * function instance and cold-starts frequently, so that `Map` was reset
 * constantly and rate limiting was effectively disabled in production.
 *
 * Fix: use Upstash Redis (durable, shared across all serverless
 * invocations) when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
 * are configured. If they are not configured, we fall back to the old
 * in-memory limiter but log a loud warning so this is never silently
 * insecure in production without the operator knowing.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  UPSTASH_URL && UPSTASH_TOKEN
    ? new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
    : null;

if (!redis && process.env.NODE_ENV === "production") {
  // Loud, unmissable warning — this is a known-critical gap (Finding 001).
  console.warn(
    "[security] UPSTASH_REDIS_REST_URL/TOKEN not set — falling back to " +
      "in-memory rate limiting, which does NOT work reliably on serverless " +
      "platforms (counters reset on every cold start). Configure Upstash " +
      "Redis to close this gap. See SECURITY_FIXES.md, Finding 001.",
  );
}

// Cache one Ratelimit instance per (limit, window) pair.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowSec: number): Ratelimit {
  const id = `${limit}:${windowSec}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      analytics: false,
      prefix: "ratelimit",
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

// ---- In-memory fallback (dev, or if Redis env vars are absent) ----
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * Rate-limit a key (e.g. `admin-login:<ip>`) to `limit` requests per
 * `windowMs` milliseconds. Durable across cold starts when Upstash Redis
 * is configured; degrades to a best-effort in-memory limiter otherwise.
 */
export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): Promise<{ allowed: boolean; remaining: number }> {
  if (redis) {
    const windowSec = Math.max(1, Math.round(windowMs / 1000));
    const { success, remaining } = await getLimiter(limit, windowSec).limit(
      key,
    );
    return { allowed: success, remaining };
  }
  return memoryRateLimit(key, limit, windowMs);
}
