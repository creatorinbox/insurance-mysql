// import { NextRequest, NextResponse } from "next/server";
// import { getUserFromToken } from "@/lib/getUserFromToken";
// import { prisma } from "@/lib/prisma";
// import Razorpay from "razorpay";

// // Razorpay test credentials (use env in production)
// const razorpay = new Razorpay({
//   key_id: "rzp_test_8RId0V4Xf3nvQM",
//   key_secret: "kfVhUIBTMccuFSx8mMHT5oRS",
// });

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getUserFromToken();

//     if (!user || user.role !== "DEALER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const body = await req.json();
//     const baseAmount = parseFloat(body.base);
//     const amount = parseFloat(body.amount);
//     const discount = parseFloat(body.discount);

//     if (isNaN(baseAmount) || isNaN(amount)) {
//       return NextResponse.json({ error: "Invalid payment values" }, { status: 400 });
//     }

//     const now = new Date();
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     const isMonthEnd = (lastDay.getDate() - now.getDate()) <= 6;

//     // Discount allowed only during month end
//     if (!isMonthEnd && discount > 0) {
//       return NextResponse.json(
//         { error: "Discount not allowed outside month end" },
//         { status: 400 }
//       );
//     }

//     const allowedDiscount = isMonthEnd ? discount : 0;
//     const expectedAmount = +(baseAmount - (baseAmount * allowedDiscount) / 100).toFixed(2);
//     const isValidAmount = Math.abs(expectedAmount - amount) < 0.01;

//     if (!isValidAmount) {
//       console.log("Expected:", expectedAmount, "Got:", amount);
//       return NextResponse.json({ error: "Incorrect payable amount" }, { status: 400 });
//     }

//     // Create Razorpay Order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(amount * 100), // Razorpay takes amount in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       notes: {
//         userId: user.id,
//         baseAmount: baseAmount.toString(),
//         discount: allowedDiscount.toString(),
//       },
//     });
// if(razorpayOrder.id){
//     // Save the order in DB
//     const saved = await prisma.payment.create({
//       data: {
//         dealerId: user.id,
//         amount,
//         discount: allowedDiscount,
//         baseAmount,
//         razorpayOrderId: razorpayOrder.id,
//         status: "paid"//date after confirmation
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       order: razorpayOrder,
//     });
//   }
//   } catch (error) {
//     console.error("[PAY_NOW_ERROR]", error);
//     return NextResponse.json({ error: "Payment failed" }, { status: 500 });
//   }
// }
// src/app/api/payments/pay-now/route.ts
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

    if (isNaN(baseAmount) || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid payment values" }, { status: 400 });
    }

    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const isMonthEnd = (lastDay.getDate() - now.getDate()) <= 6;

    // if (!isMonthEnd && discount > 0) {
    //   return NextResponse.json(
    //     { error: "Discount not allowed outside month end" },
    //     { status: 400 }
    //   );
    // }

    const allowedDiscount = isMonthEnd ? discount : 0;
    //const expectedAmount = +(baseAmount - (baseAmount * allowedDiscount) / 100).toFixed(2);

    // const isValidAmount = Math.abs(expectedAmount - amount) < 0.01;
    // if (!isValidAmount) {
    //   return NextResponse.json({ error: "Incorrect payable amount" }, { status: 400 });
    // }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        baseAmount: baseAmount.toString(),
        discount: allowedDiscount.toString(),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[PAY_NOW_ERROR]", error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}
