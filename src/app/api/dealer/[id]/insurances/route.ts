import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const dealerId = params.id;

        const insurances = await prisma.insurance.findMany({
      where: { userId: parseInt(dealerId,10)},
      orderBy: { createdAt: "desc" },
    });

    if (insurances.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const mobileNumbers = [...new Set(insurances.map((i) => i.mobile))];

    const customers = await prisma.customer.findMany({
      where: { mobile: { in: mobileNumbers } },
    });

    const customerMap = new Map(customers.map((c) => [c.mobile, c]));

  //  const validColumns = ["adld", "combo", "ew1Year", "ew2Year", "ew3Year"];
// const validColumns = ["adld", "combo1Year", "ew1Year", "ew2Year", "ew3Year"] as const;
// type ValidPolicyColumn = typeof validColumns[number];

//     const enriched = await Promise.all(
//       insurances.map(async (i) => {
//         const customer = customerMap.get(i.mobile);
//         const ewYear = i.policyType; // Ensure this is one of: adld, combo, ew1Year, etc.
//         const productName = i.productName;
//         const invoiceAmount =  parseFloat(String(i.invoiceAmount ?? "0"));

//         let policyPrice = null;

//         if (validColumns.includes(ewYear as ValidPolicyColumn)) {
//           const plan = await prisma.policyPricing.findFirst({
//             where: {
//               category: productName,
//               minAmount: { lte: invoiceAmount },
//               maxAmount: { gte: invoiceAmount },
//             },
//           });

//           if (plan && validColumns.includes(ewYear as ValidPolicyColumn) != null) {
//             policyPrice = {
//               productName,
//               ewYear,
//               price: plan[ewYear],
//             };
//           }
//         }

//         return {
//           ...i,
//           customerName: customer?.customerName || null,
//           email: customer?.email || null,
//           mobilenumber: customer?.mobile || i.mobile,
//           policyPrice,
//         };
//       })
//     );
const validColumns = ["adld", "combo1Year", "ew1Year", "ew2Year", "ew3Year"] as const;
type ValidPolicyColumn = typeof validColumns[number];

const enriched = await Promise.all(
  insurances.map(async (i) => {
    const customer = customerMap.get(i.mobile);
    const ewYear = i.policyType as ValidPolicyColumn; // Cast to union type
    const productName = i.productName;
    const invoiceAmount = parseFloat(String(i.invoiceAmount ?? "0"));

    let policyPrice = null;

    if (validColumns.includes(ewYear)) {
      const plan = await prisma.policyPricing.findFirst({
        where: {
          category: productName,
          minAmount: { lte: invoiceAmount },
          maxAmount: { gte: invoiceAmount },
        },
      });

      if (plan) {
        const price = plan[ewYear]; // Now TypeScript knows ewYear is one of the keys
        if (price != null) {
          policyPrice = {
            productName,
            ewYear,
            price,
          };
        }
      }
    }

    return {
      ...i,
      customerName: customer?.customerName || null,
      email: customer?.email || null,
      mobilenumber: customer?.mobile || i.mobile,
      policyPrice,
    };
  })
);
    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error("[INSURANCE_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch insurance data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
