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
    .from("career_support_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ submissions: data ?? [] });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "reviewed", "actioned"]),
});

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
    .from("career_support_submissions")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  return NextResponse.json({ success: true });
}
