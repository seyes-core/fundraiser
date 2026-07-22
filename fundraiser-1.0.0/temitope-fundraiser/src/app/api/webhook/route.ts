import { NextRequest, NextResponse } from "next/server";
import { verifyFlutterwaveWebhook } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { sendDonorThankYou, notifyAdmin } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

/**
 * SECURITY_AUDIT.md Finding 011: rate-limit the webhook per IP so a leaked
 * or brute-forced `verif-hash` (or plain traffic flood) can't cause
 * unbounded compute cost / DB writes. This is on top of, not instead of,
 * the signature check below.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`webhook:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const signature = req.headers.get("verif-hash") ?? "";
  const rawBody = await req.text();

  if (!verifyFlutterwaveWebhook(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = (payload as { data?: Record<string, unknown> })?.data ?? {};
  const status = data.status as string | undefined;
  const tx_ref = data.tx_ref as string | undefined;
  const flw_id = data.id;

  if (status !== "successful" || !tx_ref) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  /**
   * SECURITY_AUDIT.md Finding 002 / 020: atomic "claim" update. Only the
   * request that actually flips the row from 'pending' -> 'successful'
   * proceeds to increment stats and send emails. Any concurrent or
   * retried request (from /api/donations/verify, or Flutterwave retrying
   * this same webhook after a transient 5xx) sees 0 rows updated and exits
   * quietly — the whole handler is now idempotent and safe to retry.
   */
  const { data: donation, error } = await supabase
    .from("donations")
    .update({ status: "successful", flw_transaction_id: String(flw_id) })
    .eq("transaction_reference", tx_ref)
    .eq("status", "pending") // atomic guard — prevents the double-processing race
    .select()
    .single();

  if (error || !donation) {
    // Either a genuine DB error, OR (far more commonly) this payment was
    // already marked successful by the other handler — both are safe to
    // acknowledge as "received" so Flutterwave does not retry forever.
    if (error) {
      console.error("Webhook DB error code:", error.code);
    }
    return NextResponse.json({ received: true });
  }

  /**
   * SECURITY_AUDIT.md Finding 005: never trust the `amount` from the
   * webhook payload for financial totals — use the amount recorded in our
   * own database when the donation was initiated.
   */
  const trustedAmount = donation.amount;

  await supabase.rpc("increment_campaign_stats", { p_amount: trustedAmount });

  // Send emails (non-blocking)
  const email = donation.donor_email;
  if (email) {
    sendDonorThankYou(email, trustedAmount, tx_ref).catch((e) =>
      console.error("Donor email error:", e?.message ?? e),
    );
  }
  notifyAdmin({
    amount: trustedAmount,
    txRef: tx_ref,
    email: donation.donor_email ?? undefined,
    twitter: donation.twitter_profile ?? undefined,
    linkedin: donation.linkedin_profile ?? undefined,
    discord: donation.discord_username ?? undefined,
  }).catch((e) => console.error("Admin email error:", e?.message ?? e));

  return NextResponse.json({ received: true });
}
