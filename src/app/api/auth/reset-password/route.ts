import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
//import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: "DEALER" | "DISTRIBUTOR" | "SUPERADMIN";
  };

  const hashedPassword = password;
  //await bcrypt.hash(password, 10);

  switch (payload.role) {
    case "DEALER":
      await prisma.dealer.update({
        where: { id: payload.id },
        data: {
          password: hashedPassword,
          passwordUpdatedAt: new Date(),
        },
      });
      break;
    case "DISTRIBUTOR":
      await prisma.distributor.update({
        where: { id: payload.id },
        data: {
          password: hashedPassword,
          passwordUpdatedAt: new Date(),
        },
      });
      break;
    case "SUPERADMIN":
      await prisma.superadmin.update({
        where: { id: payload.id },
        data: {
          password: hashedPassword,
          passwordUpdatedAt: new Date(),
        },
      });
      break;
    default:
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  return NextResponse.json({ message: "Password reset successful" });
}
