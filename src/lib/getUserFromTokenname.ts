// lib/getUserFromToken.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  id: string;
  role: "SUPERADMIN" | "DISTRIBUTOR" | "DEALER";
}

export async function getUserFromTokenname(): Promise<{
  id: number;
  role: string;
  name: string;
  email: string;
} | null> {
   const cookieStore = await cookies();  // await here
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    let user = null;

    if (payload.role === "DEALER") {
      user = await prisma.dealer.findUnique({
        where: { id: parseInt(payload.id,10) },
        select: { id: true, dealerName: true, email: true },
      });
      return user ? { id: user.id, role: "DEALER", name: user.dealerName, email: user.email } : null;
    }

    if (payload.role === "DISTRIBUTOR") {
      user = await prisma.distributor.findUnique({
        where: { id: parseInt(payload.id,10) },
        select: { id: true, name: true, email: true },
      });
      return user ? { id: user.id, role: "DISTRIBUTOR", name: user.name, email: user.email } : null;
    }

    if (payload.role === "SUPERADMIN") {
      user = await prisma.superadmin.findUnique({
        where: { id: parseInt(payload.id,10) },
        select: { id: true, name: true, email: true },
      });
      return user ? { id: user.id, role: "SUPERADMIN", name: user.name, email: user.email } : null;
    }

    return null;
  } catch (err) {
    console.error("[TOKEN_PARSE_ERROR]", err);
    return null;
  }
}
