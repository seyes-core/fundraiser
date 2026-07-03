import { NextRequest, NextResponse } from "next/server";
import { guestbookSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("id, name, social_handle, message, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error)
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 },
    );
  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`guestbook:${ip}`, 3, 60_000);
  if (!allowed)
    return NextResponse.json(
      { error: "Too many submissions. Please wait." },
      { status: 429 },
    );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = guestbookSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );

  const supabase = createAdminClient();
  const { error } = await supabase.from("guestbook_entries").insert({
    ...parsed.data,
    approved: false,
  });

  if (error)
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 },
    );
  return NextResponse.json({ success: true }, { status: 201 });
}
