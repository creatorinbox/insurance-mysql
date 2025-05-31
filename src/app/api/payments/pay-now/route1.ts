import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const baseAmount = parseFloat(formData.get("base") as string);
    const amount = parseFloat(formData.get("amount") as string);
    const discount = parseFloat(formData.get("discount") as string);

    if (isNaN(baseAmount) || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid payment values" }, { status: 400 });
    }

    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const isMonthEnd = (lastDay.getDate() - now.getDate()) <= 6;

    const allowedDiscount = isMonthEnd ? discount : 0;
    const expectedAmount = baseAmount - (baseAmount * allowedDiscount) / 100;
    const isValidAmount = Math.abs(expectedAmount - amount) < 1;

    if (!isValidAmount) {
      return NextResponse.json({ error: "Invalid discount application" }, { status: 400 });
    }

    // 1. Save payment to DB
    const payment = await prisma.payment.create({
      data: {
        dealerId: user.id,
        amount,
        discount: allowedDiscount,
        baseAmount,
      },
    });

    // 2. Update Insurance: dueamount = 0 and paidstatus = "PAID"
    // await prisma.insurance.updateMany({
    //   where: {
    //     userId: user.id,
    //     paidstatus: { not: "PAID" },
    //   },
    //   data: {
    //     dueamount: "0",
    //     paidstatus: "PAID",
    //   },
    // });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("[PAY_NOW_ERROR]", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
