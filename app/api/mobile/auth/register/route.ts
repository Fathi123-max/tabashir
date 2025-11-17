import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, userType } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hashed = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, userType }, // userType matches your enum
      select: { id: true, name: true, email: true, userType: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
