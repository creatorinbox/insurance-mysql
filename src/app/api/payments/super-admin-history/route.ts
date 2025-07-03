import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// export async function GET() {
//   try {
//     const user = await getUserFromToken();
    
//     // ✅ Ensure user is a distributor
//     if (!user || user.role !== "SUPERADMIN") {
//                 return redirect("/signin");

//      // return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     // ✅ Fetch Payments
//     const payments = await prisma.payment.findMany({
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         amount: true,
//         dealerId: true, // We'll use this to fetch the distributor name
//         createdAt: true,
//   discount:true,
//   baseAmount:true,
//   paymentMode:true, 
//   referenceNumber:true,
//   remarks  :true,
//   razorpayOrderId:true,
//   razorpayPaymentId:true,
//   status        :true, 

//       },
//     });

//     // ✅ Fetch Distributor Names using userIds
//     const userIds = payments.map((payment) => payment.dealerId);
//     const distributors = await prisma.distributor.findMany({
//       where: { id: { in: userIds } }, // Get all matching distributors
//       select: { id: true, name: true },
//     });

//     // ✅ Map distributor names to payments
//     const distributorMap = distributors.reduce((acc, distributor) => {
//       acc[distributor.id] = distributor.name;
//       return acc;
//     }, {} as Record<string, string>);

//     // ✅ Format Payments with Distributor Name
//     const formattedHistory = payments.map((payment) => ({
//       ...payment,
//       distributorName: distributorMap[payment.dealerId] || "Unknown Distributor",
//     }));

//     return NextResponse.json(formattedHistory);
//   } catch (error) {
//     console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "SUPERADMIN") {
      return redirect("/signin");
    }

    // STEP 1: Get distributors created by this SUPERADMIN
    const distributors = await prisma.distributor.findMany({
      where: { userId: parseInt(user.id, 10) },
      select: { id: true, name: true },
    });

    const distributorIds = distributors.map((d) => d.id);

    // STEP 2: Get dealers created by these distributors
    const dealers = await prisma.dealer.findMany({
      where: { userId: { in: distributorIds } },
      select: { id: true, userId: true, dealerName: true },
    });

    const dealerIds = dealers.map((dealer) => dealer.id);

    // STEP 3: Get payments made by these dealers
    const payments = await prisma.payment.findMany({
      where: { dealerId: { in: dealerIds } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        baseAmount: true,
        discount: true,
        paymentMode: true,
        referenceNumber: true,
        remarks: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        status: true,
        createdAt: true,
        dealerId: true,
      },
    });

    // STEP 4: Build lookup maps
    const dealerMap = dealers.reduce((acc, dealer) => {
      acc[dealer.id] = {
        name: dealer.dealerName,
        distributorId: dealer.userId,
      };
      return acc;
    }, {} as Record<number, { name: string; distributorId: number }>);

    const distributorMap = distributors.reduce((acc, d) => {
      acc[d.id] = d.name;
      return acc;
    }, {} as Record<number, string>);

    // STEP 5: Format final response
    const formattedPayments = payments.map((p) => ({
      ...p,
      dealerName: dealerMap[p.dealerId]?.name || "Unknown Dealer",
      distributorName: distributorMap[dealerMap[p.dealerId]?.distributorId] || "Unknown Distributor",
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
