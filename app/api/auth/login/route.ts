import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_COOKIE, SESSION_SECRET } from "@/lib/auth";

// Tạo token đơn giản bằng base64 (production nên dùng JWT hoặc iron-session)
function createToken(username: string): string {
  const payload = JSON.stringify({ username, ts: Date.now() });
  return Buffer.from(`${SESSION_SECRET}:${payload}`).toString("base64");
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
  }

  const token = createToken(username);
  const res = NextResponse.json({ ok: true });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 giờ
    path: "/",
  });

  return res;
}
