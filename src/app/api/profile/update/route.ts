import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email } = await req.json();

  //let data = { email };
  if (user.role === "DEALER") {
    await prisma.dealer.update({ where: { id: user.id }, data: { dealerName: name, email } });
  } else if (user.role === "DISTRIBUTOR") {
    await prisma.distributor.update({ where: { id: user.id }, data: { name, email } });
  } else if (user.role === "SUPERADMIN") {
    await prisma.superadmin.update({ where: { id: user.id }, data: { name, email } });
  }

  return NextResponse.json({ success: true });
}
