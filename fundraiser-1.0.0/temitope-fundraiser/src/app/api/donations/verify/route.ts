import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";
import { sendDonorThankYou, sendAdminDonationNotification } from "@/lib/email";

/**
 * SECURITY_AUDIT.md Finding 012: `status` is intentionally NOT accepted
 * from the client anymore. The client only tells us *which* transaction to
 * check; whether it actually succeeded is decided exclusively by calling
 * Flutterwave's own verification API below. Trusting a client-supplied
 * status field either lets an attacker claim success for a payment that
 * never happened, or (as the audit notes) can incorrectly reject a
 * legitimate payment if Flutterwave's redirect uses a different status
 * string (`completed`) than what this endpoint expected (`successful`).
 */
const schema = z.object({
  transaction_id: z.string(),
  tx_ref: z.string(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const { transaction_id, tx_ref } = parsed.data;

  // Verify with Flutterwave API — this is the only source of truth for
  // whether the payment actually succeeded.
  let flwRes: Response;
  try {
    flwRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error(
      "Flutterwave verify request failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 502 },
    );
  }

  if (!flwRes.ok) {
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 },
    );
  }

  const flwData = await flwRes.json();
  const txData = flwData.data;

  if (
    !txData ||
    txData.status !== "successful" ||
    txData.tx_ref !== tx_ref ||
    txData.currency !== "NGN"
  ) {
    return NextResponse.json(
      { success: false, error: "Payment verification mismatch" },
      { status: 400 },
    );
  }

  const supabaseAdmin = createAdminClient();

  /**
   * SECURITY_AUDIT.md Finding 002 / 013: atomic claim, identical pattern to
   * the webhook handler. Only the request that flips 'pending' ->
   * 'successful' proceeds; the other concurrent path (webhook or a second
   * verify call) sees 0 rows affected and is treated as "already
   * processed" rather than double-incrementing campaign stats.
   */
  const { data: donation, error: updateError } = await supabaseAdmin
    .from("donations")
    .update({
      status: "successful",
      flw_transaction_id: transaction_id,
    })
    .eq("transaction_reference", tx_ref)
    .eq("status", "pending") // atomic guard
    .select()
    .single();

  if (updateError || !donation) {
    // Row not found in 'pending' state — either it doesn't exist, or (far
    // more likely) the webhook already processed it. Confirm which:
    const { data: existing } = await supabaseAdmin
      .from("donations")
      .select("status, amount")
      .eq("transaction_reference", tx_ref)
      .single();

    if (existing?.status === "successful") {
      return NextResponse.json({
        success: true,
        data: { already_processed: true, amount: existing.amount },
      });
    }

    return NextResponse.json(
      { success: false, error: "Donation not found" },
      { status: 404 },
    );
  }

  // Use the amount that was actually charged (confirmed by Flutterwave's
  // authenticated verify API), but this row's own recorded amount from
  // initiation is the same value in the normal flow — kept here for the
  // stats increment so campaign totals and the donations table always
  // agree with each other.
  const trustedAmount = txData.amount;

  await supabaseAdmin
    .from("donations")
    .update({ amount: trustedAmount })
    .eq("transaction_reference", tx_ref);

  await supabaseAdmin.rpc("increment_campaign_stats", {
    p_amount: trustedAmount,
  });

  // Send emails (non-blocking)
  if (donation.donor_email) {
    sendDonorThankYou(donation.donor_email, trustedAmount, tx_ref).catch(
      (e) => console.error("Donor email error:", e?.message ?? e),
    );
  }
  sendAdminDonationNotification(trustedAmount, tx_ref, {
    email: donation.donor_email,
    twitter: donation.twitter_profile,
    linkedin: donation.linkedin_profile,
    discord: donation.discord_username,
    anonymous: donation.anonymous,
  }).catch((e) => console.error("Admin email error:", e?.message ?? e));

  return NextResponse.json({ success: true, data: { amount: trustedAmount } });
}
