import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";
import { generateTxRef } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  amount: z.number().int().min(100).max(10_000_000),
  email: z.string().email().optional().or(z.literal("")),
  twitter_profile: z.string().max(100).optional(),
  linkedin_profile: z.string().max(200).optional(),
  discord_username: z.string().max(100).optional(),
  anonymous: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`donate:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait." },
      { status: 429 },
    );
  }

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
      { success: false, error: "Invalid request data" },
      { status: 400 },
    );
  }

  const {
    amount,
    email,
    twitter_profile,
    linkedin_profile,
    discord_username,
    anonymous,
  } = parsed.data;
  const txRef = generateTxRef();

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("donations").insert({
    amount,
    donor_email: email || null,
    twitter_profile: twitter_profile || null,
    linkedin_profile: linkedin_profile || null,
    discord_username: discord_username || null,
    anonymous,
    transaction_reference: txRef,
    status: "pending",
  });

  if (error) {
    console.error("Donation insert error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize donation" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      tx_ref: txRef,
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      amount,
      currency: "NGN",
      customer_email: email || "donor@campaign.com",
    },
  });
}
