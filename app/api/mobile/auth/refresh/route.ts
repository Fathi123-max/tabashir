import { NextResponse } from "next/server";
import { verifyRefresh, signAccessToken } from "@/app/utils/jwt";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const payload = verifyRefresh(refreshToken);
    const accessToken = signAccessToken(payload);

    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
