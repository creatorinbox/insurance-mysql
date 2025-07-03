import { prisma } from "@/lib/prisma"; // adjust if needed
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { category: string } }) {
  try {
    const pricing = await prisma.policyPricing.findFirst({
      where: { category: params.category },
    });

    if (!pricing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Extract only non-null fields among ew/adld/combo options
    const planFields = ["ew1Year", "ew2Year", "ew3Year", "adld", "combo1Year"];
    const availablePlans = planFields
      .filter((field) => pricing[field as keyof typeof pricing] != null)
      .map((field) => ({
        key: field,
        label: planLabel(field),
        value: field,
      }));

    return NextResponse.json({ availablePlans });
  } catch (err) {
    console.error("Error fetching policy pricing:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function planLabel(field: string): string {
  switch (field) {
    case "ew1Year":
      return "QYK Shield 1 Year";
    case "ew2Year":
      return "QYK Shield 2 Year";
    case "ew3Year":
      return "QYK Shield 3 Year";
    case "adld":
      return "QYK Protect";
    case "combo1Year":
      return "QYK Max";
    default:
      return field;
  }
}
