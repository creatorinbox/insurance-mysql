import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const dealerId = params.id;

  try {
    const updatedDealer = await prisma.dealer.update({
      where: { id: parseInt(dealerId,10) },
      data: { status: "TERMINATED" },
    });

    return NextResponse.json({ message: "Distributor terminated", dealer: updatedDealer }, { status: 200 });
  } catch (error) {
    console.error("Error terminating dealer:", error);
    return NextResponse.json({ error: "Failed to terminate distributor" }, { status: 500 });
  }
}
