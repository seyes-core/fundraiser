import { NextRequest, NextResponse } from "next/server";
import { verifyFlutterwaveWebhook } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { sendDonorThankYou, notifyAdmin } from "@/lib/email";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash") ?? "";
  const rawBody = await req.text();

  if (!verifyFlutterwaveWebhook(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const { status, tx_ref, id: flw_id, amount, customer } = payload.data ?? {};

  if (status !== "successful") {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // Update donation record
  const { data: donation, error } = await supabase
    .from("donations")
    .update({ status: "successful", flw_transaction_id: String(flw_id) })
    .eq("transaction_reference", tx_ref)
    .select()
    .single();

  if (error || !donation) {
    console.error("Webhook DB error:", error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  // Update campaign stats atomically
  await supabase.rpc("increment_campaign_stats", {
    p_amount: amount,
  });

  // Send emails (non-blocking)
  const email = donation.donor_email;
  if (email) {
    sendDonorThankYou(email, amount, tx_ref).catch(console.error);
  }
  notifyAdmin({
    amount,
    txRef: tx_ref,
    email: donation.donor_email ?? undefined,
    twitter: donation.twitter_profile ?? undefined,
    linkedin: donation.linkedin_profile ?? undefined,
    discord: donation.discord_username ?? undefined,
  }).catch(console.error);

  return NextResponse.json({ received: true });
}
