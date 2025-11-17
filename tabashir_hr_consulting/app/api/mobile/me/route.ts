import { NextResponse } from "next/server";
import { verifyAccess } from "@/app/utils/jwt";
import { prisma } from "@/app/utils/db";

function getAuthHeader(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1];
}

export async function GET(req: Request) {
  try {
    const token = getAuthHeader(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = verifyAccess(token);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, userType: true },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
