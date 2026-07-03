import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
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
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
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
