import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guestbook_entries")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ entries: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, approved } = await req.json();
  const supabase = createAdminClient();
  await supabase.from("guestbook_entries").update({ approved }).eq("id", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const supabase = createAdminClient();
  await supabase.from("guestbook_entries").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
