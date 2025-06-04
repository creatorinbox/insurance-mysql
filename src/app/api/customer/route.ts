// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// export async function GET(req: NextRequest) {
//     const mobile = req.nextUrl.searchParams.get("mobile");
//     if (!mobile) {
//       return NextResponse.json({ error: "Mobile number required" }, { status: 400 });
//     }
  
//     try {
//       const data = await prisma.insurance.findMany({
//         where: { mobile },
//         orderBy: { createdAt: "desc" },
//         select: {
//           id: true,
//           policyNumber: true,
//           productName: true,
//           membershipFees: true,
//           policyStartDate: true,
//           expiryDate: true,
//         },
//       });
  
//       return NextResponse.json(data);
//     } catch (error) {
//       console.error("[INSURANCE_GET_ERROR]", error);
//       return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
//   }
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const validColumns = ["adld", "combo1Year", "ew1Year", "ew2Year", "ew3Year"] as const;
type ValidPolicyColumn = typeof validColumns[number];

export async function GET(req: NextRequest) {
  const mobile = req.nextUrl.searchParams.get("mobile");
  if (!mobile) {
    return NextResponse.json({ error: "Mobile number required" }, { status: 400 });
  }

  try {
    const insurances = await prisma.insurance.findMany({
      where: { mobile },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        policyNumber: true,
        productName: true,
        membershipFees: true,
        policyStartDate: true,
        expiryDate: true,
        policyType: true, // Ensure policyType is included for lookup
        invoiceAmount: true,
      },
    });

    // Enrich insurance data with policy pricing
    const enriched = await Promise.all(
      insurances.map(async (i) => {
        const ewYear = i.policyType as ValidPolicyColumn; // Cast to union type
        const invoiceAmount = parseFloat(String(i.invoiceAmount ?? "0"));

        let policyPrice = null;

        if (validColumns.includes(ewYear)) {
          const plan = await prisma.policyPricing.findFirst({
            where: {
              category: i.productName,
              minAmount: { lte: invoiceAmount },
              maxAmount: { gte: invoiceAmount },
            },
          });

          if (plan) {
            const price = plan[ewYear]; // Now TypeScript knows ewYear is one of the keys
            if (price != null) {
              policyPrice = {
                productName: i.productName,
                ewYear,
                price,
              };
            }
          }
        }

        return {
          ...i,
          policyPrice,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[INSURANCE_GET_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
