import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

// export async function GET(req: NextRequest) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

//     // Step 1: Fetch all insurances by userId
//     const insurances = await prisma.insurance.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//     });

//     const mobileNumbers = [...new Set(insurances.map((i) => i.mobile))];
//     const policyIds = [...new Set(insurances.map((i) => i.policyNumber))];
//     const dealerUserIds = [...new Set(insurances.map((i) => i.userId))];

//     // Step 2: Fetch related entities
//     const [customers, policies, dealers] = await Promise.all([
//       prisma.customer.findMany({ where: { mobile: { in: mobileNumbers } } }),
//       prisma.policy.findMany({ where: { id: { in: policyIds } } }),
//       prisma.dealer.findMany({ where: { userId: { in: dealerUserIds } } }),
//     ]);

//     // Step 3: Create lookup maps
//     const customerMap = new Map(customers.map((c) => [c.mobile, c]));
//     const policyMap = new Map(policies.map((p) => [p.id, p]));
//     const dealerMap = new Map(dealers.map((d) => [d.userId, d]));

//     // Step 4: Combine data
//     const enriched = insurances.map((i) => {
//       const customer = customerMap.get(i.mobile || "");
//       const policy = policyMap.get(i.policyNumber || "");
//       const dealer = dealerMap.get(i.userId || "");

//       return {
//         ...i,
//         customerName: customer?.customerName || null,
//         email: customer?.email || null,
//         mobilenumber: customer?.mobile || i.mobile,
//         policy,
//         dealer,
//       };
//     });

//     return NextResponse.json(enriched);
//   } catch (error) {
//     console.error("[INSURANCE_GET_ERROR]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch insurance data" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: NextRequest) {
  try {
      const cookieHeader = req.headers.get("cookie");
            const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();
        
            if (!token) {
                         return redirect("/signin");

             // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        
            const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

            const dealer = await prisma.dealer.findUnique({
      where: { id: user.id },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // 🔸 Use dealer's locationCode and tier
    const locationCodeFromDealer = dealer.locationCode || "";
    const tierFromDealer = dealer.tier || "";
    const form = await req.formData();

    const getSafeDate = (input: FormDataEntryValue | null) => {
      const value = input?.toString() || "";
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    };
    const policyStartDate = new Date(); // current date
const expiryDate = new Date();
expiryDate.setFullYear(policyStartDate.getFullYear() + 1); // add 1 year
expiryDate.setDate(expiryDate.getDate() - 1);
// Helper: Generate 5-digit number
const generateSerial = () => Math.floor(10000 + Math.random() * 90000).toString();

// Get form fields
const ewYear = form.get("ewYear")?.toString();
const stateCode = locationCodeFromDealer|| form.get("stateCode")?.toString() ||"00"; // fallback if not present

// Get Year Code
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // "01" to "12"

const baseYear = 2025;
const yearCode = currentYear >= 2025 && currentYear <= 2040
  ? String(currentYear - baseYear + 1).padStart(2, "0")
  : "00"; // fallback if out of range

// Determine prefix
let prefix = "";
if (ewYear === "adld") {
  prefix = "QYKm";
} else if (ewYear === "combo1Year") {
  prefix = "QYKs";
} else if (["ew1Year", "ew2Year", "ew3Year"].includes(ewYear || "")) {
  prefix = "QYKp";
} else {
  prefix = "QYKx"; // fallback for unknown types
}

// Final Kit Number: prefix + state + month + yearCode + serial
const kitNumber = `${prefix}${stateCode}${currentMonth}${yearCode}${generateSerial()}`;

    const insurance = await prisma.insurance.create({
      data: {
        mobile: form.get("mobileSearch")?.toString() || "",
        kitNumber: kitNumber || "",
        policyType: form.get("ewYear")?.toString() || "",
        policyHolder: form.get("holder")?.toString() || "",
        productName: form.get("productName")?.toString() || "",
        productId: form.get("productid")?.toString() || "",
        tier: tierFromDealer || form.get("tier")?.toString() || "",
        certificateNo: form.get("certificateno")?.toString() || "",
        policyNumber: form.get("policyId")?.toString() || "",
        policyStartDate: policyStartDate,
        expiryDate: expiryDate,
        policyStatus: "Under Booking",
        make: form.get("make")?.toString() || "",
        modelNo: form.get("modelNo")?.toString() || "",
        invoiceDate: getSafeDate(form.get("invoiceDate")),
        invoiceAmount: parseFloat(form.get("invoiceAmount")?.toString() || "0"),
        invoiceNo: form.get("invoiceNo")?.toString() || "",
        imeiNumber: form.get("imeiNumber")?.toString() || "",
        salesChannel: form.get("salesChannel")?.toString() || "",
        dealerName: form.get("dealerName")?.toString() || "",
        dealerLocation: form.get("dealerLocation")?.toString() || "",
        dealerCode: form.get("dealerCode")?.toString() || "",
        vas: form.get("vas")?.toString() || "",
        businessPartnerName: form.get("businessPartnerName")?.toString() || "",
        businessPartnerCategory: form.get("businessPartnerCategory")?.toString() || "",
        lanNumber: form.get("lanNumber")?.toString() || "",
        policyBookingDate: getSafeDate(form.get("policyBookingDate")),
        membershipFees: parseFloat(form.get("membershipFees")?.toString() || "0"),
        SalesAmount: parseFloat(form.get("salesAmount")?.toString() || "0"),
        brokerDetails: form.get("brokerDetails")?.toString() || "",
        locationCode: form.get("locationCode")?.toString() || "",
        loanApiIntegration: form.get("loanApiIntegration")?.toString() || "",
        userId: user.id,
        dueamount:parseFloat(form.get("membershipFees")?.toString() || "0"),
        warrenty:form.get("planCodeId")?.toString() || "",
        paidstatus:"pending",
        updatedAt:new Date(),
      },
    });

    return NextResponse.json(insurance, { status: 201 });
  } catch (error) {
    console.error("[INSURANCE_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create insurance", details: (error as Error).message },
      { status: 500 }
    );
  }
}
// export async function GET(req: NextRequest) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

//     const insurances = await prisma.insurance.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//     });

//     if (insurances.length === 0) {
//       return NextResponse.json([], { status: 200 });
//     }

//     const mobileNumbers = [...new Set(insurances.map((i) => i.mobile))];
//     const policyNumbers = [...new Set(insurances.map((i) => i.policyNumber))];
//     const dealerUserIds = [...new Set(insurances.map((i) => i.userId))];

//     const [customers, policies, dealers] = await Promise.all([
//       prisma.customer.findMany({ where: { mobile: { in: mobileNumbers } } }),
//      // prisma.policy.findMany({ where: { policynumber: { in: policyNumbers } } }),
// //prisma.dealer.findMany({ where: { userId: { in: dealerUserIds } } }),
//     ]);

//     const customerMap = new Map(customers.map((c) => [c.mobile, c]));
//    // const policyMap = new Map(policies.map((p) => [p.policynumber, p]));
//    // const dealerMap = new Map(dealers.map((d) => [d.userId, d]));

//     const enriched = insurances.map((i) => {
//       const customer = customerMap.get(i.mobile);
//      // const policy = policyMap.get(i.policyNumber);
//       //const dealer = dealerMap.get(i.userId);

//       return {
//         ...i,
//         customerName: customer?.customerName || null,
//         email: customer?.email || null,
//         mobilenumber: customer?.mobile || i.mobile,
//         //policy,
//        // dealer,
//       };
//     });

//     return NextResponse.json(enriched, { status: 200 });

//   } catch (error) {
//     console.error("[INSURANCE_GET_ERROR]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch insurance data", details: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
                 return redirect("/signin");

    //  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const insurances = await prisma.insurance.findMany({
      where: { userId: user.id },
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