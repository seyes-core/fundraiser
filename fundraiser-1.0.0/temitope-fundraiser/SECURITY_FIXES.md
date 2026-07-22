# Security Fixes — Resolution Log

This document records how each finding in `SECURITY_AUDIT.md`
(`C:\Users\azureuser\Documents\GitHub\SECURITY_AUDIT.md`) was resolved.
20 of 21 findings are fixed in code; 1 low-severity finding (endpoint path
obscurity) is an accepted risk with a documented rationale.

| # | Finding | Status |
|---|---|---|
| 001 | Rate limiting non-functional on Vercel | ✅ Fixed |
| 002 | Double-payment race condition | ✅ Fixed |
| 003 | Token timestamp NaN bypass | ✅ Fixed |
| 004 | HTML injection in admin emails | ✅ Fixed |
| 005 | Webhook amount trusted from payload | ✅ Fixed |
| 006 | Dual authentication systems | ✅ Fixed |
| 007 | No Content Security Policy | ✅ Fixed |
| 008 | Admin stats PATCH — no validation | ✅ Fixed |
| 009 | No logout mechanism / plaintext password concerns | ✅ Fixed |
| 010 | LinkedIn/URL fields accept any URL | ✅ Fixed |
| 011 | Webhook has no rate limiting | ✅ Fixed |
| 012 | Verify endpoint trusts client `status` | ✅ Fixed |
| 013 | Non-atomic stats update in verify route | ✅ Fixed |
| 014 | No CSRF/Origin check on admin routes | ✅ Fixed |
| 015 | Fallback default secret in auth module | ✅ Fixed |
| 016 | No HTTPS redirect / HSTS header | ✅ Fixed |
| 017 | Admin endpoint structure discoverable | ⚠️ Accepted risk |
| 018 | Guestbook spam without authentication | ✅ Fixed |
| 019 | Missing logout functionality | ✅ Fixed |
| 020 | Webhook 500 causes retry-driven inflation | ✅ Fixed |
| 021 | `console.error` leaks internal DB errors | ✅ Fixed |

---

## Finding 001 — Rate Limiting Completely Non-Functional on Vercel

**Fix:** Rewrote `src/lib/rate-limit.ts` to use **Upstash Redis**
(`@upstash/redis` + `@upstash/ratelimit`, added to `package.json`) as a
durable, shared store across serverless cold starts. `rateLimit()` is now
`async`; every call site was updated to `await` it:
`api/donate`, `api/donations/initiate`, `api/career-support`,
`api/guestbook`, `api/admin/login`, and the newly rate-limited
`api/webhook` (see Finding 011).

If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are not set, the
module falls back to the old in-memory limiter **and logs a loud
`console.warn` in production** so this gap is never silent. You can see
this warning fire during the build in this repo today — it will disappear
once Upstash credentials are added to the environment.

**Action required to fully close this gap:** create a free Upstash Redis
database and set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` in
your deployment environment (e.g. Vercel project settings).

---

## Finding 002 — Double-Payment Race Condition

**Fix:** Both `src/app/api/webhook/route.ts` and
`src/app/api/donations/verify/route.ts` now use the atomic "claim" pattern
recommended in the audit:

```ts
.update({ status: "successful", ... })
.eq("transaction_reference", tx_ref)
.eq("status", "pending")   // atomic guard
.select()
.single();
```

Only the request that actually flips the row from `pending` →
`successful` proceeds to increment campaign stats and send emails. Any
concurrent or retried request sees 0 rows affected and exits quietly. This
single change also resolves **Finding 013** (verify route now uses the
same atomic `increment_campaign_stats` RPC as the webhook instead of a
manual read-modify-write) and **Finding 020** (because the handler is now
idempotent, a Flutterwave retry after a transient failure is safe — it
will simply find the row already `successful` and no-op).

---

## Finding 003 — Token Timestamp NaN Bypass

**Fix:** `src/lib/auth.ts` — `verifyAdminToken()` now explicitly guards
against a non-numeric timestamp before comparing:

```ts
const tsNum = parseInt(ts, 10);
if (!Number.isFinite(tsNum)) return false;
if (Date.now() - tsNum > 8 * 60 * 60 * 1000) return false;
```

Also hardened the signature comparison to decode both sides as hex bytes
and check length equality before `timingSafeEqual` (defensive; the
original try/catch already prevented a crash, this makes the intent
explicit).

---

## Finding 004 — HTML Injection / XSS in Admin Email Templates

**Fix:** Added `src/lib/html.ts` with an `escapeHtml()` utility. Every
donor-controlled field (`email`, `twitter`, `linkedin`, `discord`, `txRef`,
formatted amount) interpolated into the admin notification email in
`src/lib/email.ts` (`notifyAdmin`) is now escaped before being placed in
the HTML template.

---

## Finding 005 — Webhook Amount Trusted From Payload, Not Database

**Fix:** `src/app/api/webhook/route.ts` no longer passes the webhook
payload's `amount` to `increment_campaign_stats`. After the atomic claim
update returns the donation row, the handler uses
**`donation.amount`** — the value recorded in our own database when the
donation was initiated — for both the stats increment and the email
notifications.

---

## Finding 006 — Dual Authentication Systems

**Fix:** Deleted `src/lib/admin-auth.ts` entirely (it checked a cookie,
`admin_session`, that nothing in the app ever sets). Updated
`src/app/api/admin/career-support/route.ts` to import
`isAdminAuthenticated` from `src/lib/auth.ts` (the system the login route
actually uses, cookie `admin_token`) — matching every other admin route.
The Submissions tab in the admin dashboard now actually loads data.

---

## Finding 007 — No Content Security Policy

**Fix:** Rewrote the security headers block, now in `next.config.js`
(see note on Finding 016 below about why `.js` and not `.ts`) and applied
to **every route** (`/:path*`), not just `/api/*`:

- `Content-Security-Policy` — `default-src 'self'`, with explicit
  allowances for Google Fonts (`style-src`/`font-src`), the Flutterwave
  inline checkout script/frame, Supabase/Flutterwave `connect-src`, and
  `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.
- `Strict-Transport-Security` (see Finding 016)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` disabling camera/microphone/geolocation
- Existing `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
  retained.

---

## Finding 008 — Admin Stats PATCH Has No Input Validation

**Fix:** `src/app/api/admin/stats/route.ts` now validates the PATCH body
with a Zod schema (`id` must be a UUID, `amount_raised` and `donor_count`
are bounded non-negative integers) before touching the database, exactly
as recommended.

---

## Finding 009 — Admin Password / No Logout &nbsp;·&nbsp; Finding 019 — Missing Logout

**Fix:** Added `src/app/api/admin/logout/route.ts` (`POST`) which clears
the `admin_token` cookie (`maxAge: 0`). Added a **"Log out"** button to
the admin dashboard header in `src/app/admin/page.tsx` that calls it and
resets local auth state. Confirmed no route logs the raw request body for
the login route.

*(Caveat documented in code comments: tokens are stateless HMAC values —
logout clears the browser's cookie but cannot revoke a copy of the token
an attacker may have already exfiltrated. True server-side revocation
would require a Redis-backed denylist of issued token IDs — noted as a
follow-up, not implemented here to avoid scope creep beyond the audit's
own recommendation list.)*

---

## Finding 010 — LinkedIn/URL Fields Accept Any URL

**Fix:** `src/lib/validation.ts` replaces the bare `z.string().url()` for
`linkedin` (donation form) and `linkedin_url` (career support form) with a
shared `linkedinUrlSchema` that parses the URL and rejects anything whose
hostname isn't `linkedin.com` or `*.linkedin.com`.

---

## Finding 011 — Webhook Has No Rate Limiting

**Fix:** `src/app/api/webhook/route.ts` now calls `rateLimit()` (Finding
001's Redis-backed limiter) keyed by IP, 30 requests/minute, before even
checking the signature — capping compute cost from a flood of
signature-failing requests. Combined with the idempotent atomic update
(Finding 002), the "check if `flw_transaction_id` already exists" concern
from the audit is satisfied by the `status = 'pending'` guard.

---

## Finding 012 — Donations Verify Endpoint Trusts Client-Supplied `status`

**Fix:** `src/app/api/donations/verify/route.ts` — the Zod schema no
longer accepts or checks a client-supplied `status` field at all. The
request only supplies `transaction_id` and `tx_ref`; whether the payment
succeeded is decided exclusively by calling Flutterwave's authenticated
verification API. This also fixes the `completed` vs `successful` string
mismatch the audit called out, since the client's status string is never
consulted.

---

## Finding 013 — Non-Atomic Campaign Stats Update in Verify Route

**Fix:** resolved together with Finding 002 — see above. `verify/route.ts`
now calls `increment_campaign_stats` via the same atomic RPC the webhook
uses, instead of a manual `select` → add in JS → `update`.

---

## Finding 014 — No CSRF Protection on State-Changing Admin Routes

**Fix:** Added `src/lib/csrf.ts` — `verifyAdminOrigin(req)` compares the
request's `Origin` (falling back to `Referer`) header against
`NEXT_PUBLIC_SITE_URL`. Applied to every state-changing admin route
**after** the existing `isAdminAuthenticated` check (defense in depth,
not a replacement):

- `api/admin/stats` (PATCH)
- `api/admin/guestbook` (PATCH, DELETE)
- `api/admin/submissions` (PATCH)
- `api/admin/updates` (POST)
- `api/admin/career-support` (PATCH)

(Login is intentionally excluded — it doesn't mutate any state an
attacker could benefit from forging a request to before authentication
exists.)

---

## Finding 015 — Fallback Default Secret in Auth Module

**Fix:** `src/lib/auth.ts` — `getAdminJwtSecret()` now **throws** if
`ADMIN_JWT_SECRET` is unset instead of silently falling back to the
public string `"dev-secret"`. This fails loudly (build/runtime error) the
moment the token functions are invoked without the secret configured,
rather than quietly accepting forgeable tokens in production.

---

## Finding 016 — No HTTPS Redirect or HSTS Header

**Fix:** `Strict-Transport-Security: max-age=63072000; includeSubDomains;
preload` added alongside the CSP work in Finding 007.

**Bonus discovery while fixing this:** the repo had *both* a
`next.config.ts` and a `next.config.js`. Next.js 14 (the version pinned in
`package.json`) **does not support `next.config.ts` at all** — confirmed
by reproducing the exact build error, `Configuring Next.js via
'next.config.ts' is not supported`. That means the `.ts` file (which is
where headers had originally been added in this fix pass) was **silently
ignored** and `next.config.js` was the only config Next.js ever actually
loaded. The two files had drifted apart. Consolidated everything into the
single `next.config.js` and deleted the dead `.ts` copy so this can't
happen again.

---

## Finding 017 — Admin Endpoint Structure Publicly Discoverable

**Status: accepted risk, not implemented.** The audit itself rates this
Low severity and notes the fix ("rename to `/api/mgmt/` or `/api/private/`")
is "not a strong defense." Every admin route already requires a valid,
HMAC-signed `admin_token` cookie (Findings 003/006/015 harden that check),
so renaming paths would only add security-through-obscurity on top of a
control that is already the real gate. Renaming now would also require
updating every `fetch()` call in `src/app/admin/page.tsx` and increases
the diff surface for negligible benefit. Recommendation: keep the source
repository private, which the audit also suggests, and revisit if this
app's admin surface grows.

---

## Finding 018 — Guestbook Spam Without Authentication

**Fix:** Two layers, per the audit's own recommendation:

1. Rate limiting is now durable (Finding 001), so the "effectively
   unlimited" spam vector because of a broken limiter is closed.
2. Added a **honeypot field** (`website`) to `guestbookSchema` in
   `src/lib/validation.ts` and to the actual form
   (`src/components/sections/GuestbookForm.tsx`) — a visually hidden,
   `tabindex="-1"`, `aria-hidden` input that real users never see or fill.
   `src/app/api/guestbook/route.ts` silently accepts (HTTP 201, no error
   shown) but does **not** write to the database if that field is
   non-empty, so unsophisticated bots that fill every input get a
   convincing no-op instead of a signal to adapt.

---

## Finding 019 — Missing Logout Functionality

**Fix:** see Finding 009 above (same fix — logout route + dashboard
button).

---

## Finding 020 — Webhook Returns 500 on DB Error, Causing Retry Storms

**Fix:** resolved together with Finding 002. Because both the webhook and
verify handlers now use the atomic `status = 'pending'` guard, any
Flutterwave retry after a transient failure is idempotent — it either
successfully claims the still-pending row exactly once, or finds it
already `successful` and no-ops. The retry-driven double-increment
scenario the audit described is no longer possible regardless of how many
times the webhook fires for the same transaction.

---

## Finding 021 — `console.error` Leaks Internal DB Errors to Logs

**Fix:** Every `console.error` call across the API routes
(`webhook`, `donations/verify`, `donations/initiate`, `donate`,
`admin/stats`, `admin/updates`) now logs only a narrow, non-sensitive
detail — a Supabase error `code`, or an `Error.message` — instead of
serializing the entire error/response object, which could otherwise
include table names, column names, or other schema internals useful to an
attacker with log access.

---

## New environment variables

This fix pass introduces two new **optional-but-strongly-recommended**
environment variables (Finding 001):

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Get these from a free Upstash Redis database at https://upstash.com. All
other required variables are unchanged from `.env.example`. Note that
`ADMIN_JWT_SECRET` is now a hard startup-time requirement (Finding 015) —
if it is unset, any route touching admin auth or the Flutterwave webhook
signature will throw immediately rather than degrade silently.

## Verification performed

- `npx tsc --noEmit` — passes with no errors.
- `npm run build` — production build succeeds; the Finding 001 fallback
  warning was confirmed to print exactly as designed when Upstash env
  vars are absent.
- No new ESLint/type errors introduced (checked via the editor's linter
  across all changed files).
