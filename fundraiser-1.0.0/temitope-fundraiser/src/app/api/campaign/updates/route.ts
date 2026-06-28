import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("campaign_updates")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });
  return NextResponse.json({ updates: data ?? [] });
}
