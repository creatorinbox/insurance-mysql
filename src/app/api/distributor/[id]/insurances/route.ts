// // // app/api/distributor/[id]/insurances/route.ts

// // import { prisma } from "@/lib/prisma";
// // import { NextRequest, NextResponse } from "next/server";
// // import jwt from "jsonwebtoken";

// // export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     const distributorId = params.id;

// //     const cookieHeader = req.headers.get("cookie");
// //     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

// //     if (!token) {
// //       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// //     }

// //     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

// //     if (user.role !== "SUPERADMIN") {
// //       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
// //     }

// //     // ✅ Step 1: Get dealers under this distributor
// //     const dealers = await prisma.dealer.findMany({
// //       where: { userId: distributorId },
// //       select: { id: true, dealerName: true },
// //     });

// //     const dealerIdToNameMap = new Map(dealers.map((d) => [d.id, d.dealerName]));
// //     const dealerIds = dealers.map((d) => d.id);

// //     // ✅ Step 2: Get insurance created by those dealers
// //     const insurances = await prisma.insurance.findMany({
// //       where: { userId: { in: dealerIds } },
// //       select: {
// //         id: true,
// //         invoiceAmount: true,
// //         dueamount: true,
// //         dealerName: true,
// //       },
// //     });

// //     // ✅ Step 3: Map data with dealerName
// //     const enriched = insurances.map((i) => ({
// //       id: i.id,
// //       invoiceAmount: i.invoiceAmount,
// //       dueamount: i.dueamount,
// //       dealerName: dealerIdToNameMap.get(i.dealerName) || "Unknown",
// //     }));

// //     return NextResponse.json(enriched);
// //   } catch (error) {
// //     console.error("[superadmin_insurance_list]", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }
// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const distributorId = params.id;

//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

//     if (user.role !== "SUPERADMIN") {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     // Step 1: Get dealers under this distributor
//     const dealers = await prisma.dealer.findMany({
//       where: { userId: distributorId },
//       select: { id: true, dealerName: true },
//     });

//     const dealerIdToNameMap = new Map(dealers.map((d) => [d.id, d.dealerName]));

//     // Step 2: For each dealer, try to get latest payment, fallback to insurance due
//     const results = [];

//     for (const dealer of dealers) {
//       const latestPayment = await prisma.payment.findFirst({
//         where: { dealerId: dealer.id },
//         orderBy: { createdAt: "desc" },
//       });

//       if (latestPayment) {
//         results.push({
//           dealerId: dealer.id,
//           dealerName: dealer.dealerName,
//           source: "payment",
//           invoiceAmount: latestPayment.baseAmount,
//           dueAmount: 0,
//           discount: latestPayment.discount,
//         });
//       } else {
//         const insurances = await prisma.insurance.findMany({
//           where: { userId: dealer.id },
//           select: { invoiceAmount: true, dueamount: true },
//         });

//         const invoiceTotal = insurances.reduce(
//           (sum, i) => sum + parseFloat(i.invoiceAmount || "0"),
//           0
//         );
//         const dueTotal = insurances.reduce(
//           (sum, i) => sum + parseFloat(i.dueamount || "0"),
//           0
//         );

//         results.push({
//           dealerId: dealer.id,
//           dealerName: dealer.dealerName,
//           source: "insurance",
//           invoiceAmount: invoiceTotal,
//           dueAmount: dueTotal,
//           discount: 0,
//         });
//       }
//     }

//     return NextResponse.json(results);
//   } catch (error) {
//     console.error("[superadmin_insurance_list]", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const distributorId = params.id;

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    if (user.role !== "SUPERADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Step 1: Get all dealers under the distributor
    const dealers = await prisma.dealer.findMany({
      where: { userId: distributorId },
      select: { id: true, dealerName: true },
    });

    const results = [];

    for (const dealer of dealers) {
      // Step 2: Get all insurances created by the dealer
      const insurances = await prisma.insurance.findMany({
        where: { userId: dealer.id },
        select: { invoiceAmount: true },
      });

      // Sum total invoice amount
const totalInvoiceAmount = insurances.reduce((sum, i) => {
  const amount = parseFloat(String(i.invoiceAmount ?? "0"));
  return sum + (isNaN(amount) ? 0 : amount);
}, 0);

      // Step 3: Get total payments made by the dealer
      const payments = await prisma.payment.findMany({
        where: { dealerId: dealer.id },
        select: { amount: true },
      });

      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

      // Step 4: Calculate due amount
      //const dueAmount = totalInvoiceAmount - totalPaid;

      results.push({
        dealerId: dealer.id,
        dealerName: dealer.dealerName,
        //totalInvoiceAmount,
       // totalPaid,
         invoiceAmount: totalInvoiceAmount,
          dueAmount: totalPaid-totalInvoiceAmount,
       // dueAmount,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("[superadmin_insurance_list]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
