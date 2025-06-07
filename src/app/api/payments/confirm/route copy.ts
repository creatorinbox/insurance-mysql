// src/app/api/payments/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUserFromToken";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, paymentId, signature, base, amount, discount,dealerId } = await req.json();

    // 1. Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", "kfVhUIBTMccuFSx8mMHT5oRS")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Save Payment Record
    await prisma.payment.create({
      data: {
        dealerId: parseInt(user.id,10),
        amount: parseFloat(amount),
        baseAmount: parseFloat(base),
        discount: parseFloat(discount),
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PAYMENT_CONFIRM_ERROR]", err);
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
