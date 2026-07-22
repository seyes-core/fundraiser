import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { verifyAdminOrigin } from "@/lib/csrf";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const { data } = await supabase.from("campaign_stats").select("*").single();
  return NextResponse.json(data);
}

/**
 * SECURITY_AUDIT.md Finding 008: the PATCH body previously flowed straight
 * into the DB update with zero validation, letting an authenticated admin
 * (or anyone who compromised the admin session) set arbitrary/negative/
 * absurd values, or target an arbitrary row via `id`. Validate shape and
 * bounds with Zod before touching the database.
 */
const statsPatchSchema = z.object({
  id: z.string().uuid(),
  amount_raised: z.number().int().min(0).max(10_000_000),
  donor_count: z.number().int().min(0).max(100_000),
});

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!verifyAdminOrigin(req))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = statsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { id, amount_raised, donor_count } = parsed.data;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaign_stats")
    .update({
      amount_raised,
      donor_count,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Stats update error code:", error.code);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
  return NextResponse.json(data);
}
