// lib/getUserFromToken.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function getUserFromToken(): Promise<{
  id: string;
  role: "DEALER" | "DISTRIBUTOR" | "SUPERADMIN";
  name: string;
  email: string;
  passwordUpdatedAt?: Date;
  expired?: boolean;
} | null> {
   const cookieStore = await cookies();  // await here
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "DEALER" | "DISTRIBUTOR" | "SUPERADMIN";
    };

    let user = null;

    if (payload.role === "DEALER") {
      user = await prisma.dealer.findUnique({
        where: { id: payload.id },
        select: { dealerName: true, email: true, passwordUpdatedAt: true },
      });
      if (!user) return null;
      return {
        id: payload.id,
        role: payload.role,
        name: user.dealerName,
        email: user.email,
        passwordUpdatedAt: user.passwordUpdatedAt ?? undefined,
        expired:
          user.passwordUpdatedAt ?
          new Date(user.passwordUpdatedAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) : undefined,
      };
    }

    if (payload.role === "DISTRIBUTOR") {
      user = await prisma.distributor.findUnique({
        where: { id: payload.id },
        select: { name: true, email: true, passwordUpdatedAt: true },
      });
      if (!user) return null;
      return {
        id: payload.id,
        role: payload.role,
        name: user.name,
        email: user.email,
        passwordUpdatedAt: user.passwordUpdatedAt ?? undefined,
        expired:
          user.passwordUpdatedAt ?
          new Date(user.passwordUpdatedAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) : undefined,
      };
    }

    if (payload.role === "SUPERADMIN") {
      user = await prisma.superadmin.findUnique({
        where: { id: payload.id },
        select: { name: true, email: true, passwordUpdatedAt: true },
      });
      if (!user) return null;
      return {
        id: payload.id,
        role: payload.role,
        name: user.name,
        email: user.email,
        passwordUpdatedAt: user.passwordUpdatedAt ?? undefined,
        expired:
          user.passwordUpdatedAt ?
          new Date(user.passwordUpdatedAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) : undefined,
      };
    }

    return null;
  } catch (err) {
    console.error("[TOKEN_PARSE_ERROR]", err);
    return null;
  }
}
