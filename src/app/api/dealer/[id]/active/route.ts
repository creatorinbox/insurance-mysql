import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.dealer.update({
      where: { id: parseInt(params.id,10) },
      data: { status: "ACTIVE" },
    });

    return NextResponse.json({ message: "Dealer activated" });
  } catch (error) {
    console.error("[activate_dealer]", error);
    return NextResponse.json({ error: "Failed to activate dealer" }, { status: 500 });
  }
}
