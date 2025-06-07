import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUserFromToken();
    
    // ✅ Ensure user is a distributor
    if (!user || user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Fetch Payments
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        dealerId: true, // We'll use this to fetch the distributor name
        createdAt: true,
  discount:true,
  baseAmount:true,
  paymentMode:true, 
  referenceNumber:true,
  remarks  :true,
  razorpayOrderId:true,
  razorpayPaymentId:true,
  status        :true, 

      },
    });

    // ✅ Fetch Distributor Names using userIds
    const userIds = payments.map((payment) => payment.dealerId);
    const distributors = await prisma.distributor.findMany({
      where: { id: { in: userIds } }, // Get all matching distributors
      select: { id: true, name: true },
    });

    // ✅ Map distributor names to payments
    const distributorMap = distributors.reduce((acc, distributor) => {
      acc[distributor.id] = distributor.name;
      return acc;
    }, {} as Record<string, string>);

    // ✅ Format Payments with Distributor Name
    const formattedHistory = payments.map((payment) => ({
      ...payment,
      distributorName: distributorMap[payment.dealerId] || "Unknown Distributor",
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
