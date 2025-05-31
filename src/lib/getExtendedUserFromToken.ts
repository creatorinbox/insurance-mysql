// lib/getExtendedUserFromToken.ts
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function getExtendedUserFromToken(): Promise<{
  id: string;
  role: "SUPERADMIN" | "DISTRIBUTOR" | "DEALER";
  passwordUpdatedAt: Date | null;
  expired: boolean;
} | null> {
  const user = await getUserFromToken();
  if (!user) return null;

  let result: { passwordUpdatedAt: Date | null } | null = null;

  if (user.role === "DEALER") {
    result = await prisma.dealer.findUnique({
      where: { id: user.id },
      select: { passwordUpdatedAt: true },
    });
  } else if (user.role === "DISTRIBUTOR") {
    result = await prisma.distributor.findUnique({
      where: { id: user.id },
      select: { passwordUpdatedAt: true },
    });
  } else if (user.role === "SUPERADMIN") {
    result = await prisma.superadmin.findUnique({
      where: { id: user.id },
      select: { passwordUpdatedAt: true },
    });
  }

  const lastUpdated = result?.passwordUpdatedAt ?? new Date(0);
  const expired = lastUpdated < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 3 months

  return {
    id: user.id,
    role: user.role,
    passwordUpdatedAt: result?.passwordUpdatedAt ?? null,
    expired,
  };
}
