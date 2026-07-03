import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaign_stats")
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({
      goal_amount: 350000,
      amount_raised: 0,
      donor_count: 0,
    });
  }
  return NextResponse.json(data);
}
