import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function getUserIfPasswordExpired(token: string): Promise<{ expired: boolean }> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "DEALER" | "DISTRIBUTOR" | "SUPERADMIN";
    };

    const { id, role } = decoded;
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    let user: { passwordUpdatedAt?: Date | null } | null = null;

    if (role === "DEALER") {
      user = await prisma.dealer.findUnique({ where: { id:parseInt(id,10) }, select: { passwordUpdatedAt: true } });
    } else if (role === "DISTRIBUTOR") {
      user = await prisma.distributor.findUnique({ where: { id:parseInt(id,10) }, select: { passwordUpdatedAt: true } });
    } else if (role === "SUPERADMIN") {
      user = await prisma.superadmin.findUnique({ where: { id:parseInt(id,10) }, select: { passwordUpdatedAt: true } });
    }

    if (!user) return { expired: false };

    const lastUpdated = user.passwordUpdatedAt ?? new Date(0);
    return { expired: lastUpdated < threeMonthsAgo };
  } catch (err) {
    console.error("[TOKEN_CHECK_FAIL]", err);
    return { expired: false };
  }
}
