import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signAdminToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`admin-login:${ip}`, 5, 300_000); // 5 attempts per 5 min
  if (!allowed)
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!password || !expected)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match =
    password.length === expected.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(expected));

  if (!match)
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

  const token = signAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 8 * 60 * 60,
    path: "/",
  });
  return res;
}
