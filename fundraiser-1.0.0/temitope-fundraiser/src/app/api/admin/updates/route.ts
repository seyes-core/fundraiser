import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("campaign_updates")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ updates: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, content } = await req.json();
  if (!title || !content)
    return NextResponse.json(
      { error: "Title and content required" },
      { status: 400 },
    );
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaign_updates")
    .insert({ title, content })
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
