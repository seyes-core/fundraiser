import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { verifyAdminOrigin } from "@/lib/csrf";
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

const patchSchema = z.object({ id: z.string().uuid(), approved: z.boolean() });

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!verifyAdminOrigin(req))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createAdminClient();
  await supabase
    .from("guestbook_entries")
    .update({ approved: parsed.data.approved })
    .eq("id", parsed.data.id);
  return NextResponse.json({ success: true });
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!verifyAdminOrigin(req))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = deleteSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createAdminClient();
  await supabase.from("guestbook_entries").delete().eq("id", parsed.data.id);
  return NextResponse.json({ success: true });
}
