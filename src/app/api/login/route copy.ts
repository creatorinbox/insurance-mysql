import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.roleid, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  const response = NextResponse.json({ message: "Login successful" });

  // Save token (which includes user id) as httpOnly cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
