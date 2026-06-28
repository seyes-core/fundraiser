import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase';
import { sendDonorThankYou, sendAdminDonationNotification } from '@/lib/email';

const schema = z.object({
  transaction_id: z.string(),
  tx_ref: z.string(),
  status: z.string(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  const { transaction_id, tx_ref, status } = parsed.data;

  if (status !== 'successful') {
    return NextResponse.json({ success: false, error: 'Payment was not successful' }, { status: 400 });
  }

  // Verify with Flutterwave API
  const flwRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!flwRes.ok) {
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
  }

  const flwData = await flwRes.json();
  const txData = flwData.data;

  if (
    txData.status !== 'successful' ||
    txData.tx_ref !== tx_ref ||
    txData.currency !== 'NGN'
  ) {
    return NextResponse.json({ success: false, error: 'Payment verification mismatch' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // Get the donation record
  const { data: donation, error: fetchError } = await supabaseAdmin
    .from('donations')
    .select('*')
    .eq('transaction_reference', tx_ref)
    .single();

  if (fetchError || !donation) {
    return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 });
  }

  if (donation.status === 'successful') {
    return NextResponse.json({ success: true, data: { already_processed: true } });
  }

  // Update donation status
  const { error: updateError } = await supabaseAdmin
    .from('donations')
    .update({
      status: 'successful',
      flw_transaction_id: transaction_id,
      amount: txData.amount,
    })
    .eq('transaction_reference', tx_ref);

  if (updateError) {
    return NextResponse.json({ success: false, error: 'Failed to update donation' }, { status: 500 });
  }

  // Update campaign stats
  const { data: stats } = await supabaseAdmin
    .from('campaign_stats')
    .select('*')
    .single();

  if (stats) {
    await supabaseAdmin
      .from('campaign_stats')
      .update({
        amount_raised: Number(stats.amount_raised) + Number(txData.amount),
        donor_count: stats.donor_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stats.id);
  }

  // Send emails (non-blocking)
  if (donation.donor_email) {
    sendDonorThankYou(donation.donor_email, txData.amount, tx_ref).catch(console.error);
  }
  sendAdminDonationNotification(txData.amount, tx_ref, {
    email: donation.donor_email,
    twitter: donation.twitter_profile,
    linkedin: donation.linkedin_profile,
    discord: donation.discord_username,
    anonymous: donation.anonymous,
  }).catch(console.error);

  return NextResponse.json({ success: true, data: { amount: txData.amount } });
}
