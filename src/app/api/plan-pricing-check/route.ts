import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define exact keys your model allows
type EWYear = "ew1Year" | "ew2Year" | "ew3Year" | "adld" | "combo1Year";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { productName, ewYear, invoiceAmount } = body;

  // Type guard for ewYear
  if (!["adld", "combo1Year", "ew1Year", "ew2Year", "ew3Year"].includes(ewYear)) {
    return NextResponse.json({ valid: false, message: "Invalid ewYear type" }, { status: 400 });
  }

  const yearKey = ewYear as EWYear; // 👈 Cast it to the specific type

  const plan = await prisma.policyPricing.findFirst({
    where: {
      category: productName,
      minAmount: { lte: parseFloat(invoiceAmount) },
      maxAmount: { gte: parseFloat(invoiceAmount) },
    },
  });

  if (!plan || !plan[yearKey]) {
    return NextResponse.json({ valid: false, message: "Plan not found" }, { status: 404 });
  }

  const price = plan[yearKey];
 let ewyears;
if (yearKey === "adld") {
  ewyears = "QYK Max";
} else if (yearKey === "combo1Year") {
  ewyears = "QYK Shield";
} else if (yearKey === "ew1Year") {
  ewyears = "QYK Pro 1 Year";
} else if (yearKey === "ew2Year") {
  ewyears = "QYK Pro 2 Year";
} else if (yearKey === "ew3Year") {
  ewyears = "QYK Pro 3 Year";
}
  return NextResponse.json({
    valid: true,
    plan: {
      category: plan.category,
      ewYear: ewyears,
      price,
    },
  });
};
