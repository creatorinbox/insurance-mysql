import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  const user = await getUserFromToken();
  if (!user) return redirect("/signin");

  const { name, email } = await req.json();

  //let data = { email };
  if (user.role === "DEALER") {
    await prisma.dealer.update({ where: { id: parseInt(user.id,10) }, data: { dealerName: name, email } });
  } else if (user.role === "DISTRIBUTOR") {
    await prisma.distributor.update({ where: { id: parseInt(user.id,10) }, data: { name, email } });
  } else if (user.role === "SUPERADMIN") {
    await prisma.superadmin.update({ where: { id: parseInt(user.id,10) }, data: { name, email } });
  }

  return NextResponse.json({ success: true });
}
