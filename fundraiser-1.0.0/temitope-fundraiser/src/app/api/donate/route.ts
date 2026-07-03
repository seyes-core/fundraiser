import { NextRequest, NextResponse } from "next/server";
import { donationSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase";
import { generateTxRef } from "@/lib/format";

export async function POST(req: NextRequest) {
  // Rate limit: 5 donation initiations per IP per minute
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`donate:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const { amount, email, twitter, linkedin, discord } = parsed.data;
  const txRef = generateTxRef();

  // Store pending donation in Supabase
  const supabase = createAdminClient();
  const { error: dbError } = await supabase.from("donations").insert({
    amount,
    donor_email: email || null,
    twitter_profile: twitter || null,
    linkedin_profile: linkedin || null,
    discord_username: discord || null,
    anonymous: !email,
    transaction_reference: txRef,
    status: "pending",
  });

  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json(
      { error: "Failed to record donation. Please try again." },
      { status: 500 },
    );
  }

  // Build Flutterwave payment link
  const flwData = {
    tx_ref: txRef,
    amount,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd,apple_pay,googlepay",
    redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
    customer: {
      email: email || "anonymous@donor.temi",
      name: "Donor",
    },
    customizations: {
      title: "Temitope's Laptop Campaign",
      description: "Helping Temitope get his first dev laptop",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    },
    meta: { tx_ref: txRef },
  };

  try {
    const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flwData),
    });
    const flwJson = await flwRes.json();
    if (flwJson.status !== "success") {
      throw new Error(flwJson.message ?? "Flutterwave error");
    }
    return NextResponse.json({
      payment_link: flwJson.data.link,
      tx_ref: txRef,
    });
  } catch (err) {
    console.error("Flutterwave error:", err);
    return NextResponse.json(
      { error: "Payment gateway error. Please try again." },
      { status: 502 },
    );
  }
}
