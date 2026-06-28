import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const { data } = await supabase.from("career_support_submissions").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ submissions: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  const supabase = createAdminClient();
  await supabase.from("career_support_submissions").update({ status }).eq("id", id);
  return NextResponse.json({ success: true });
}
