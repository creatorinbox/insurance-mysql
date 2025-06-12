import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUserFromToken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid"; // Import UUID for uniqueness
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "DISTRIBUTOR") {
           return redirect("/signin");

     // return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { orderId, paymentId, signature, base, amount, discount, dealerIds } = await req.json();

    // ✅ Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", "kfVhUIBTMccuFSx8mMHT5oRS")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
const invoiceNumber = `INV-${Date.now()}-${uuidv4().slice(0, 8)}`;
    // ✅ Store Bulk Payment Records
    await prisma.payment.createMany({
      data: dealerIds.map((dealerId: number) => ({
        dealerId,
        amount: parseFloat(amount) / dealerIds.length, // Split amount across dealers if needed
        baseAmount: parseFloat(base) / dealerIds.length,
        discount: parseFloat(discount) / dealerIds.length,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        status: "PAID",
        invoiceNumber,
      })),
    });

    // ✅ Bulk Update Insurance Records
    await prisma.insurance.updateMany({
      where: {
        userId: { in: dealerIds }, // ✅ Update multiple dealers
        paidstatus: { not: "PAID" },
      },
      data: {
        dueamount: 0,
        paidstatus: "PAID",
        policyStatus:"Under Review",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PAYMENT_CONFIRM_ERROR]", err);
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
