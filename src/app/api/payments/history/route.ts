// src/app/api/payments/history/route.ts
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "DISTRIBUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const history = await prisma.payment.findMany({
      where: { dealerId: parseInt(user.id,10) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
