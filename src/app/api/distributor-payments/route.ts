// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";
// // import jwt from "jsonwebtoken";
// // import { truncate } from "fs";

// // export async function GET(req: Request) {
// //   try {
// //     const cookieHeader = req.headers.get("cookie");
// //     const token = cookieHeader
// //       ?.split("token=")[1]
// //       ?.split(";")[0]
// //       ?.trim();

// //     if (!token) {
// //       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// //     }

// //     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

// //     if (user.role !== "DISTRIBUTOR") {
// //       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
// //     }

// //     // Find dealers created by this distributor
// //     const dealers = await prisma.dealer.findMany({
// //       where: { userId: user.id },
// //       select: { id: true, dealerName: true, status: true },
// //     });
// //     console.log("All delaers:", dealers);

// //     const dealerIds = dealers.map((dealer) => dealer.id);
// //     const dealerIdToNameMap = new Map(dealers.map((d) => [d.id, d.dealerName]));
// //     console.log("dealerid:", dealerIds);

// //     // Find insurance entries created by these dealers
// //     const insurances = await prisma.insurance.findMany({
// //       where: {
// //         dealerName: { in: dealerIds },
// //       },
// //     });
// //     console.log("All insurances:", insurances);

// //     // Group by dealer and sum sales and due
// //     const summary = dealerIds.map((dealerId) => {
// //       const entries = insurances.filter((i) => i.dealerName === dealerId);
// //       console.log('ent',entries)
// //       const salesAmount = entries.reduce((acc, i) => acc + (parseFloat(i.invoiceAmount) || 0), 0);
// //       const dueAmount = entries.reduce((acc, i) => acc + (parseFloat(i.dueamount) || 0), 0);
// //       const dealer = dealers.find((d) => d.id === dealerId);

// //       return {
// //         id: dealerId,
// //         dealerName: dealerIdToNameMap.get(dealerId),
// //         salesAmount,
// //         dueAmount,
// //         status: dealer?.status,
// //       };
// //     });

// //     return NextResponse.json(summary);
// //   } catch (error: unknown) {
// //     const err = error as { message?: string };
// //     console.error("[distributor_payments_GET]", err?.message || error);
// //     return NextResponse.json({ error: "Failed to fetch distributor payments" }, { status: 500 });
// //   }
// // }
// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";
// // import jwt from "jsonwebtoken";

// // export async function GET(req: Request) {
// //   try {
// //     const cookieHeader = req.headers.get("cookie");
// //     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

// //     if (!token) {
// //       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// //     }

// //     const user = jwt.verify(token, process.env.JWT_SECRET!) as {
// //       id: string;
// //       role: string;
// //     };

// //     if (user.role !== "DISTRIBUTOR") {
// //       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
// //     }

// //     const dealers = await prisma.dealer.findMany({
// //       where: { userId: user.id },
// //       select: { id: true, dealerName: true, status: true },
// //     });

// //     const dealerIds = dealers.map((d) => d.id);
// //     const dealerMap = new Map(dealers.map((d) => [d.id, d]));

// //     const today = new Date();
// //     const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
// //     const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

// //     // Get latest payments if available
// //     const payments = await prisma.payment.findMany({
// //       where: {
// //         dealerId: { in: dealerIds },
// //         createdAt: { gte: startDate, lte: endDate },
// //       },
// //       orderBy: { createdAt: "desc" },
// //     });

// //     const paymentMap = new Map<string, { baseAmount: number }>();
// //     for (const p of payments) {
// //       if (!paymentMap.has(p.dealerId)) {
// //         paymentMap.set(p.dealerId, { baseAmount: p.amount });
// //       }
// //     }

// //     const insurances = await prisma.insurance.findMany({
// //       where: {
// //         userId: { in: dealerIds },
// //         policyBookingDate: { gte: startDate, lte: endDate },
// //       },
// //       select: { userId: true, invoiceAmount: true, dueamount: true },
// //     });

// //     const groupedInsurance: Record<string, { sales: number; due: number }> = {};

// //     for (const i of insurances) {
// //       const id = i.userId;
// //       if (!groupedInsurance[id]) {
// //         groupedInsurance[id] = { sales: 0, due: 0 };
// //       }
// //       groupedInsurance[id].sales += parseFloat(i.invoiceAmount || "0");
// //     //groupedInsurance[id].due += parseFloat(i.dueamount || "0");
// //     }
// //     const summary = dealerIds.map((id) => {
// //       const paymentData = paymentMap.get(id);
// //       const insuranceData = groupedInsurance[id];
// // const due=insuranceData?.sales - paymentData?.baseAmount;
// //       const dealer = dealerMap.get(id);

// //       return {
// //         id,
// //         dealerName: dealer?.dealerName,
// //         status: dealer?.status,
// //         salesAmount: insuranceData?.sales || 0,
// //         dueAmount: due|| 0,
// //         paidThisMonth: Boolean(paymentData),
// //       };
// //     });

// //     return NextResponse.json(summary);
// //   } catch (error: any) {
// //     console.error("[distributor_payments_GET]", error?.message || error);
// //     return NextResponse.json(
// //       { error: "Failed to fetch distributor payments" },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//       role: string;
//     };

//     if (user.role !== "DISTRIBUTOR") {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     // Get all dealers under this distributor
//     const dealers = await prisma.dealer.findMany({
//       where: { userId: user.id },
//       select: { id: true, dealerName: true, status: true },
//     });

//     const dealerIds = dealers.map((d) => d.id);
//     const dealerMap = new Map(dealers.map((d) => [d.id, d]));

//     const today = new Date();
//     const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//     const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     // Get all insurances for this month by dealers
//     const insurances = await prisma.insurance.findMany({
//       where: {
//         userId: { in: dealerIds },
//         policyBookingDate: { gte: startDate, lte: endDate },
//       },
//       select: {
//         userId: true,
//         invoiceAmount: true,
//       },
//     });

//     // Group insurances per dealer
//     const insuranceTotals: Record<string, number> = {};
//     for (const i of insurances) {
//       const id = i.userId;
//       const amt = parseFloat(i.invoiceAmount || "0");
//       insuranceTotals[id] = (insuranceTotals[id] || 0) + amt;
//     }

//     // Get all payments made by these dealers this month
//     const payments = await prisma.payment.findMany({
//       where: {
//         dealerId: { in: dealerIds },
//         createdAt: { gte: startDate, lte: endDate },
//       },
//       select: {
//         dealerId: true,
//         baseAmount: true,
//       },
//     });

//     // Group payment totals per dealer
//     const paymentTotals: Record<string, number> = {};
//     for (const p of payments) {
//       paymentTotals[p.dealerId] = (paymentTotals[p.dealerId] || 0) + p.baseAmount;
//     }

//     // Create summary
//     const summary = dealerIds.map((id) => {
//       const dealer = dealerMap.get(id);
//       const sales = insuranceTotals[id] || 0;
//       const paid = paymentTotals[id] || 0;
//       const due = sales - paid;

//       return {
//         id,
//         dealerName: dealer?.dealerName,
//         status: dealer?.status,
//         salesAmount: sales,
//         paidAmount: paid,
//         dueAmount: due,
//       };
//     });

//     return NextResponse.json(summary);
//   } catch (error: any) {
//     console.error("[distributor_payments_GET]", error?.message || error);
//     return NextResponse.json(
//       { error: "Failed to fetch distributor payments" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
                         return redirect("/signin");
      
      //return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (user.role !== "DISTRIBUTOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const distributor = await prisma.distributor.findUnique({
      where: { id: parseInt(user.id) },
    });

    if (!distributor) {
      return NextResponse.json({ message: "Distributor not found" }, { status: 404 });
    }

    const dealers = await prisma.dealer.findMany({
      where: { userId: parseInt(user.id,10) },
      select: { id: true, dealerName: true, status: true,plan: true, dealerLocation:true,businessPartnerName:true},
    });

    const dealerIds = dealers.map((d) => d.id);
    const dealerMap = new Map(dealers.map((d) => [d.id, d]));

    //const today = new Date("2025-05-31");
    const today = new Date();
  //  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const isMonthEnd = (endDate.getDate() - today.getDate()) <= 6;
console.log('monthend',isMonthEnd);
    // Fetch insurances this month by all dealers
    const insurances = await prisma.insurance.findMany({
      where: {
        userId: { in: dealerIds },
       // policyBookingDate: { gte: startDate, lte: endDate },
      },
      select: { userId: true, invoiceAmount: true , dueamount:true,SalesAmount:true},
    });

    // Group insurance totals
    const insuranceTotals: Record<string, number> = {};
        const dueTotals: Record<string, number> = {};

    const insuranceCounts: Record<string, number> = {};
    for (const i of insurances) {
      const id = i.userId;
     // const amt = parseFloat(i.invoiceAmount || "0");
       const amt = typeof i.SalesAmount === "string" ? parseFloat(i.SalesAmount) : i.SalesAmount || 0;
      const dueamt = typeof i.dueamount === "string" ? parseFloat(i.dueamount) : i.dueamount || 0;


      insuranceTotals[id] = (insuranceTotals[id] || 0) + amt;
       dueTotals[id] = (dueTotals[id] || 0) + dueamt;

      insuranceCounts[id] = (insuranceCounts[id] || 0) + 1;
    }

    // Fetch payments made by dealers this month
    const payments = await prisma.payment.findMany({
      where: {
        dealerId: { in: dealerIds },
        //createdAt: { gte: startDate, lte: endDate },
      },
      select: { dealerId: true, baseAmount: true },
    });

    const paymentTotals: Record<string, number> = {};
    for (const p of payments) {
      paymentTotals[p.dealerId] = (paymentTotals[p.dealerId] || 0) + p.baseAmount;
    }

    // Fetch Plan and Tiers
    let tiers: { insuranceCount: number; discountPercent: number }[] = [];
    if (distributor.plan) {
      const plan = await prisma.plan.findFirst({
        where: {
          id: distributor.plan,
          role: "DISTRIBUTOR",
        },
        include: {
          tiers: {
            orderBy: { insuranceCount: "desc" },
          },
        },
      });
      tiers = plan?.tiers || [];
    }

    // const summary = dealerIds.map((id) => {
    //   const dealer = dealerMap.get(id);
    //   const salesAmount = insuranceTotals[id] || 0;
    //   const insuranceCount = insuranceCounts[id] || 0;
    //   const paidAmount = paymentTotals[id] || 0;
    //   const dueAmount = salesAmount - paidAmount;

    //   let discount = 0;
    //   let finalDue = dueAmount;
    //   let effectiveDeduction = 15;

    //   if (dueAmount > 0 && tiers.length && isMonthEnd) {
    //     const matchingTier = tiers.find((tier) => tier.insuranceCount <= insuranceCount);
    //     if (matchingTier) {
    //       discount = matchingTier.discountPercent;
    //       effectiveDeduction = 15 - discount;

    //       const discVal = (salesAmount * discount) / 100;
    //       const commission = (dueAmount * 15) / 100;
    //       finalDue = dueAmount - (discVal - commission);
    //     } else {
    //       finalDue = dueAmount - (dueAmount * 15) / 100;
    //     }
    //   } else {
    //     finalDue = dueAmount - (dueAmount * 15) / 100;
    //   }

    //   return {
    //     id,
    //     dealerName: dealer?.dealerName,
    //     status: dealer?.status,
    //     salesAmount,
    //     paidAmount,
    //     dueAmount,
    //     effectiveDeduction,
    //     finalDue,
    //   };
    // });
const summary = await Promise.all(
  dealerIds.map(async (id) => {
    const dealer = dealerMap.get(id);
    const salesAmount = insuranceTotals[id] || 0;
    const insuranceCount = insuranceCounts[id] || 0;
    const paidAmount = paymentTotals[id] || 0;
    const dueAmount = dueTotals[id] || 0;

    let distributorDiscount = 0;
    let dealerDiscount = 0;
    let finalDue = dueAmount;
    let effectiveDeduction = 15;
let gst=0;
let sgst=0;
    // 👉 Apply distributor tier discount if eligible
    if (tiers.length && isMonthEnd && dueAmount > 0) {
      const matchingTier = tiers.find((tier) => tier.insuranceCount <= insuranceCount);
      if (matchingTier) distributorDiscount = matchingTier.discountPercent;
    }

    // 👉 Fetch dealer plan and apply tier discount
    if (dealer?.plan && isMonthEnd && dueAmount > 0) {
      const dealerPlan = await prisma.plan.findFirst({
        where: {
          id: dealer.plan,
          role: "DEALER",
        },
        include: {
          tiers: {
            orderBy: { insuranceCount: "desc" },
          },
        },
      });

      const dealerMatchingTier = dealerPlan?.tiers.find(
        (tier) => tier.insuranceCount <= insuranceCount
      );

      if (dealerMatchingTier) {
        dealerDiscount = dealerMatchingTier.discountPercent;
      }
    }

    const totalDiscount = distributorDiscount + dealerDiscount;
    effectiveDeduction = Math.max(15 - totalDiscount, 0);

    if (dueAmount > 0) {
      if (isMonthEnd && totalDiscount > 0) {
        const discVal = (salesAmount * totalDiscount) / 100;
        const commission = (dueAmount * 15) / 100;
        const finalDiscount = discVal - commission;
        finalDue = dueAmount - finalDiscount;
      } else {
        finalDue = dueAmount - (dueAmount * 15 / 100);
      }
       gst = (finalDue * 9) / 100;
   sgst = (finalDue * 9) / 100;

    // ✅ Update final due amount including taxes
    finalDue = finalDue + gst + sgst;
    }

    return {
      id,
      dealerName: dealer?.dealerName,
      status: dealer?.status,
      dealerLocation:dealer?.dealerLocation,
    businessPartnerName:dealer?.businessPartnerName,
      salesAmount,
      paidAmount,
      dueAmount,
      effectiveDeduction,
      finalDue,
      distributorDiscount,
      dealerDiscount,
      gst,
      sgst,
    };
  })
);

    return NextResponse.json(summary);
  } catch (error: unknown) {
    console.error("[distributor_payments_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch distributor payments" },
      { status: 500 }
    );
  }
}
