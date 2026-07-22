import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { verifyAdminOrigin } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("career_support_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
  if (!verifyAdminOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const { id, status } = await request.json().catch(() => ({}));
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from("career_support_submissions")
    .update({ status })
    .eq("id", id);

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  return NextResponse.json({ success: true });
}
