import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const dealerId = params.id;

    const insurances = await prisma.insurance.findMany({
      where: {
        userId: dealerId, // Note: dealerName stores dealer ID
      },
      select: {
        id: true,
        invoiceAmount: true,
        dueamount: true,
      },
    });

    return NextResponse.json(insurances);
  } catch (error) {
    console.error("[DEALER_INSURANCE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch insurance records" },
      { status: 500 }
    );
  }
}
