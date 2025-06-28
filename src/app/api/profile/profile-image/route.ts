import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(user.id, 10);
    const role = user.role;

    let profileImage: string | null = null;

    if (role === "SUPERADMIN") {
      const result = await prisma.superadmin.findUnique({ where: { id: userId }, select: { profileImage: true } });
      profileImage = result?.profileImage || null;
    } else if (role === "DEALER") {
      const result = await prisma.dealer.findUnique({ where: { id: userId }, select: { profileImage: true } });
      profileImage = result?.profileImage || null;
    } else if (role === "DISTRIBUTOR") {
      const result = await prisma.distributor.findUnique({ where: { id: userId }, select: { profileImage: true } });
      profileImage = result?.profileImage || null;
    } else {
      return NextResponse.json({ error: "Unknown role" }, { status: 400 });
    }

    return NextResponse.json({ profileImage }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
