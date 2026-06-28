import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("donations")
    .select("id, amount, donor_email, twitter_profile, linkedin_profile, discord_username, anonymous, transaction_reference, status, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const header = "id,amount,donor_email,twitter_profile,linkedin_profile,discord_username,anonymous,transaction_reference,status,created_at\n";
  const csv = header + rows.map((r) =>
    [r.id, r.amount, r.donor_email ?? "", r.twitter_profile ?? "", r.linkedin_profile ?? "",
     r.discord_username ?? "", r.anonymous, r.transaction_reference, r.status, r.created_at
    ].map((v) => `"${v}"`).join(",")
  ).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
