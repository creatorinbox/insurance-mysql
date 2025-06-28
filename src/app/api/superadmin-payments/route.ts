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

// //     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

// //     if (user.role !== "SUPERADMIN") {
// //       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
// //     }

// //     // 1. Find all distributors created by this superadmin
// //     const distributors = await prisma.distributor.findMany({
// //       where: { userId: user.id },
// //       select: { id: true, name: true,status: true },
// //     });

// //     const distributorIds = distributors.map((d) => d.id);

// //     // 2. Find all dealers created by these distributors
// //     const dealers = await prisma.dealer.findMany({
// //       where: { userId: { in: distributorIds } },
// //       select: { id: true, userId: true },
// //     });

// //     const dealerIdToDistributorId = new Map(dealers.map(d => [d.id, d.userId]));

// //     // 3. Find all insurances created by these dealers
// //     const dealerIds = dealers.map(d => d.id);

// //     const insurances = await prisma.insurance.findMany({
// //       where: { dealerName: { in: dealerIds } },
// //     });

// //     // 4. Group sales and due by distributor
// //     const distributorSummary: Record<string, { distributorId: string; distributorName: string; salesAmount: number; dueAmount: number }> = {};

// //     for (const insurance of insurances) {
// //       const dealerId = insurance.dealerName;
// //       const distributorId = dealerIdToDistributorId.get(dealerId);

// //       if (!distributorId) continue;

// //       if (!distributorSummary[distributorId]) {
// //         const distributor = distributors.find(d => d.id === distributorId);
// //         distributorSummary[distributorId] = {
// //           distributorId,
// //           distributorName: distributor?.name || "Unknown",
// //           salesAmount: 0,
// //           dueAmount: 0,
// //           status:distributor?.status,
// //         };
// //       }

// //       distributorSummary[distributorId].salesAmount += parseFloat(insurance.invoiceAmount || "0");
// //       distributorSummary[distributorId].dueAmount += parseFloat(insurance.dueamount || "0");
// //     }

// //     return NextResponse.json(Object.values(distributorSummary));
// //   } catch (error) {
// //     console.error("[superadmin_payments_GET]", error);
// //     return NextResponse.json({ error: "Failed to fetch superadmin payments" }, { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { redirect } from "next/navigation";

// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

//     if (!token) {
//       return redirect("/signin");
//       //return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//       role: string;
//     };

//     if (user.role !== "SUPERADMIN") {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     const today = new Date();
//     const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//     const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     // 1. Find all distributors under superadmin
//     const distributors = await prisma.distributor.findMany({
//       where: { userId: parseInt(user.id,10) },
//       select: { id: true, name: true, status: true, mobile:true,city:true,contactPerson:true },
//     });

//     const distributorIds = distributors.map((d) => d.id);

//     // 2. Find dealers under these distributors
//     const dealers = await prisma.dealer.findMany({
//       where: { userId: { in: distributorIds } },
//       select: { id: true, userId: true },
//     });

//     //const dealerMap = new Map(dealers.map((d) => [d.id, d.userId])); // dealerId -> distributorId
//     const dealerIds = dealers.map((d) => d.id);

//     // 3. Get payments if they exist this month
//     const payments = await prisma.payment.findMany({
//       where: {
//         dealerId: { in: dealerIds },
//         createdAt: { gte: startDate, lte: endDate },
//       },
//     });

//     //const paidDealers = new Set(payments.map((p) => p.dealerId));
//     const dealerToPayment = new Map(
//       payments.map((p) => [p.dealerId, { baseAmount: p.amount }])
//     );

//     // 4. Fallback to insurance
//     const insurances = await prisma.insurance.findMany({
//       where: {
//         userId: { in: dealerIds },
//         policyBookingDate: { gte: startDate, lte: endDate },
//       },
//       select: { userId: true, invoiceAmount: true, dueamount: true },
//     });

//     const dealerInsuranceMap: Record<string, { sales: number; due: number }> = {};
//     for (const ins of insurances) {
//       const id = ins.userId;
//       if (!dealerInsuranceMap[id]) {
//         dealerInsuranceMap[id] = { sales: 0, due: 0 };
//       }
//       dealerInsuranceMap[id].sales += ins.invoiceAmount ?? 0;
//       dealerInsuranceMap[id].due += ins.dueamount ?? 0;
//     }

//     // 5. Group by distributor
//     const distributorSummary: Record<
//       string,
//       { distributorId: number; distributorName: string; salesAmount: number; dueAmount: number; status: string; mobile:string;city:string;contactPerson:string; }
//     > = {};

//     for (const dealer of dealers) {
//       const distributorId = dealer.userId;
//       const distributor = distributors.find((d) => d.id === distributorId);
//       if (!distributor) continue;

//       if (!distributorSummary[distributorId]) {
//         distributorSummary[distributorId] = {
//           distributorId,
//           distributorName: distributor.name,
//           mobile:distributor.mobile,
//           city:distributor.city,
//           contactPerson:distributor.contactPerson,
//           salesAmount: 0,
//           dueAmount: 0,
//           status: distributor.status,
//         };
//       }

//       const payment = dealerToPayment.get(dealer.id);
//       const insurance = dealerInsuranceMap[dealer.id];

//       if (payment) {
//         distributorSummary[distributorId].salesAmount += insurance?.sales || payment.baseAmount;
//         distributorSummary[distributorId].dueAmount += insurance?.sales - payment?.baseAmount;
//       } else {
//         distributorSummary[distributorId].salesAmount += insurance?.sales || 0;
//         distributorSummary[distributorId].dueAmount += insurance?.due || 0;
//       }
//     }

//     return NextResponse.json(Object.values(distributorSummary));
//   } catch (error) {
//     console.error("[superadmin_payments_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch superadmin payments" },
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
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (user.role !== "SUPERADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 1. Get ALL Distributors under SUPERADMIN
    const distributors = await prisma.distributor.findMany({
      where: { userId: parseInt(user.id, 10) },
      select: {
        id: true,
        name: true,
        status: true,
        mobile: true,
        city: true,
        contactPerson: true,
      },
    });

    const distributorIds = distributors.map((d) => d.id);

    // 2. Get all dealers created by these distributors
    const dealers = await prisma.dealer.findMany({
      where: { userId: { in: distributorIds } },
      select: { id: true, userId: true },
    });

    const dealerIds = dealers.map((d) => d.id);

    // 3. Get payments for this month
    const payments = await prisma.payment.findMany({
      where: {
        dealerId: { in: dealerIds },
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const dealerToPayment = new Map(
      payments.map((p) => [p.dealerId, { baseAmount: p.amount }])
    );

    // 4. Get insurance data for this month
    const insurances = await prisma.insurance.findMany({
      where: {
        userId: { in: dealerIds },
        policyBookingDate: { gte: startDate, lte: endDate },
      },
      select: {
        userId: true,
        invoiceAmount: true,
        dueamount: true,
      },
    });

    const dealerInsuranceMap: Record<
      string,
      { sales: number; due: number }
    > = {};

    for (const ins of insurances) {
      const id = ins.userId;
      if (!dealerInsuranceMap[id]) {
        dealerInsuranceMap[id] = { sales: 0, due: 0 };
      }
      dealerInsuranceMap[id].sales += ins.invoiceAmount ?? 0;
      dealerInsuranceMap[id].due += ins.dueamount ?? 0;
    }

    // 5. Initialize ALL distributors, even without dealers
    const distributorSummary: Record<
      string,
      {
        distributorId: number;
        distributorName: string;
        salesAmount: number;
        dueAmount: number;
        status: string;
        mobile: string;
        city: string;
        contactPerson: string;
      }
    > = {};

    for (const distributor of distributors) {
      distributorSummary[distributor.id] = {
        distributorId: distributor.id,
        distributorName: distributor.name,
        mobile: distributor.mobile,
        city: distributor.city,
        contactPerson: distributor.contactPerson,
        salesAmount: 0,
        dueAmount: 0,
        status: distributor.status,
      };
    }

    // 6. Update distributor data based on dealer activity
    for (const dealer of dealers) {
      const distributorId = dealer.userId;
      const summary = distributorSummary[distributorId];
      if (!summary) continue;

      const payment = dealerToPayment.get(dealer.id);
      const insurance = dealerInsuranceMap[dealer.id];

      if (payment) {
        summary.salesAmount += insurance?.sales || payment.baseAmount;
        summary.dueAmount += (insurance?.sales || 0) - payment.baseAmount;
      } else {
        summary.salesAmount += insurance?.sales || 0;
        summary.dueAmount += insurance?.due || 0;
      }
    }

    return NextResponse.json(Object.values(distributorSummary));
  } catch (error) {
    console.error("[superadmin_payments_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch superadmin payments" },
      { status: 500 }
    );
  }
}
