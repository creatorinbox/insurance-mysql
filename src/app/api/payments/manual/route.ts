// app/api/payments/manual/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
     const user = await getUserFromToken();
    
        if (!user || user.role !== "DISTRIBUTOR") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    const data = await req.json();

    const {
        base,
      amount,
      paymentMode,
      referenceNumber,
      remarks,
      dealerId
    } = data;

    if (!amount || !paymentMode || !referenceNumber) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        dealerId:user.id,
        amount: parseFloat(amount),
        baseAmount: parseFloat(base),
        discount: 0,
        paymentMode,
        referenceNumber,
        remarks,
        status: "PAID",
      },
    });
// 3. Update Insurance Records
    await prisma.insurance.updateMany({
      where: {
        userId: dealerId,
        paidstatus: { not: "PAID" },
      },
      data: {
        dueamount: parseFloat("0"),
        paidstatus: "PAID",
      },
    });
    return NextResponse.json(payment);
  } catch (error) {
    console.error("[MANUAL_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to record manual payment" },
      { status: 500 }
    );
  }
}
