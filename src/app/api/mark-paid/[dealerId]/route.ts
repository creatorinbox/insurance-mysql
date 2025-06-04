// app/api/mark-paid/[dealerId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { dealerId: string } }
) {
  const dealerId = params.dealerId;

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  try {
    const updated = await prisma.insurance.updateMany({
      where: {
        userId: parseInt(dealerId,10),
        policyBookingDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        paidstatus: { not: "PAID" }, // optional safety
      },
      data: {
        paidstatus: "PAID",
        dueamount: parseFloat("0"),
      },
    });

    return NextResponse.json({ message: "Success", count: updated.count });
  } catch (err) {
    console.error("❌ Error marking as paid:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
