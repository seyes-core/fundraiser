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
    .from("campaign_updates")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ updates: data ?? [] });
}

const postSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!verifyAdminOrigin(req))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaign_updates")
    .insert({ title: parsed.data.title, content: parsed.data.content })
    .select()
    .single();
  if (error) {
    console.error("Update insert error code:", error.code);
    return NextResponse.json({ error: "Failed to save update" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
