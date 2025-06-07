import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getUserFromToken } from "@/lib/getUserFromToken";

const razorpay = new Razorpay({
  key_id: "rzp_test_8RId0V4Xf3nvQM",
  key_secret: "kfVhUIBTMccuFSx8mMHT5oRS",
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "DISTRIBUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const baseAmount = parseFloat(body.base);
    const amount = parseFloat(body.amount);
    const discount = parseFloat(body.discount);
    const dealerIds = body.dealerIds; // ✅ Handle multiple dealer IDs

    if (isNaN(baseAmount) || isNaN(amount) || !Array.isArray(dealerIds) || dealerIds.length === 0) {
      return NextResponse.json({ error: "Invalid payment values or missing dealers" }, { status: 400 });
    }

    // ✅ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        baseAmount: baseAmount.toString(),
        discount: discount.toString(),
        dealerIds: dealerIds.join(","), // Store dealer IDs for bulk processing
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[PAY_NOW_ERROR]", error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}
