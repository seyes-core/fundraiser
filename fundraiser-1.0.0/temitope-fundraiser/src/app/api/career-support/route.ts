import { NextRequest, NextResponse } from "next/server";
import { careerSupportSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`career:${ip}`, 5, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many submissions." }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = careerSupportSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("career_support_submissions").insert({
    ...parsed.data,
    status: "new",
  });

  if (error) return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
