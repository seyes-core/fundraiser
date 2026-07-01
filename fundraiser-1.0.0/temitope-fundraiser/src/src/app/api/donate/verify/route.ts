// src/app/api/donate/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const txRef = req.nextUrl.searchParams.get("tx_ref");
  if (!txRef) return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("donations")
    .select("status")
    .eq("transaction_reference", txRef)
    .single();

  return NextResponse.json({ status: data?.status ?? "pending" });
}