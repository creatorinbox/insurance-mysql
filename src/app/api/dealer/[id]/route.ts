import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

//import jwt from "jsonwebtoken";

// interface JwtPayload {
//   id: number;
//   role: string;
// }

// ✅ Define the `DealerUpdateData` Interface
interface DealerUpdateData {
  salesChannel?: string;
  dealerName?: string;
  dealerLocation?: string;
  dealerCode?: string;
  vas?: string;
  businessPartnerName?: string;
  businessPartnerCategory?: string;
  lanNumber?: string;
  policyBookingDate?: Date;
  membershipFees?: string;
  brokerDetails?: string;
  locationCode?: string;
  loanApiIntegration?: string;
  plan?: number;
  email?: string;
  status?: string;
  tier?: string;
  updatedAt?: Date;
}

export async function PUT(req: NextRequest) {
  try {
    // ✅ Extract and verify JWT token
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
                   return redirect("/signin");

     // return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
    }

    

    // ✅ Extract Dealer ID from URL
    const dealerId = req.nextUrl.pathname.split("/").pop();
    if (!dealerId || isNaN(parseInt(dealerId, 10))) {
      return NextResponse.json({ error: "Dealer ID is required and must be a number" }, { status: 400 });
    }

    const form = await req.formData();

    // ✅ Check if dealer exists before updating
    const existingDealer = await prisma.dealer.findUnique({
      where: { id: parseInt(dealerId, 10) },
      select: {
        salesChannel: true,
        dealerName: true,
        dealerLocation: true,
        dealerCode: true,
        vas: true,
        businessPartnerName: true,
        businessPartnerCategory: true,
        lanNumber: true,
        policyBookingDate: true,
        membershipFees: true,
        brokerDetails: true,
        locationCode: true,
        loanApiIntegration: true,
        plan: true,
        email: true,
        status: true,
        tier: true,
        updatedAt: true,
      },
    });

    if (!existingDealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // ✅ Function to safely retrieve form data or keep existing values
    const safeGet = (field: keyof DealerUpdateData) => {
  const value = form.has(field) ? form.get(field)?.toString().trim() : existingDealer[field as keyof DealerUpdateData];

  // ✅ Convert numbers and dates to strings to prevent TypeScript errors
  if (typeof value === "number") return value.toString();
  if (value instanceof Date) return value.toISOString();

  return value === null ? undefined : value;
};

    // ✅ Use Interface to Ensure Type Safety
    const updatedData: DealerUpdateData = {
      salesChannel: safeGet("salesChannel"),
      dealerName: safeGet("dealerName"),
      dealerLocation: safeGet("dealerLocation"),
      dealerCode: safeGet("dealerCode"),
      vas: safeGet("vas"),
      businessPartnerName: safeGet("businessPartnerName"),
      businessPartnerCategory: safeGet("businessPartnerCategory"),
      lanNumber: safeGet("lanNumber"),
      policyBookingDate: form.has("policyBookingDate")
        ? new Date(safeGet("policyBookingDate") || existingDealer.policyBookingDate)
        : existingDealer.policyBookingDate,
      membershipFees: safeGet("membershipFees"),
      brokerDetails: safeGet("brokerDetails"),
      locationCode: safeGet("locationCode"),
      loanApiIntegration: safeGet("loanApiIntegration"),
      plan: form.has("planId") ? parseInt(safeGet("plan") || existingDealer.plan.toString(), 10) : existingDealer.plan,
      email: safeGet("email"),
      status: existingDealer.status,
      tier: safeGet("tier"),
      updatedAt: new Date(),
    };

    // ✅ Perform Update
    const updatedDealer = await prisma.dealer.update({
      where: { id: parseInt(dealerId, 10) },
      data: updatedData,
    });

    return NextResponse.json(updatedDealer, { status: 200 });
  } catch (error) {
    console.error("[DEALER_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Dealer update failed" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    // ✅ Extract JWT token from cookie
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
    }

   

    // ✅ Extract dealer ID from the request URL
    const dealerId = req.nextUrl.pathname.split("/").pop();
    if (!dealerId || isNaN(parseInt(dealerId, 10))) {
      return NextResponse.json({ error: "Dealer ID is required and must be a number" }, { status: 400 });
    }

    // ✅ Retrieve dealer details from the database
    const dealer = await prisma.dealer.findUnique({
      where: { id: parseInt(dealerId, 10) },
      select: {
        id: true,
        salesChannel: true,
        dealerName: true,
        email: true,
        dealerLocation: true,
        dealerCode: true,
        vas: true,
        businessPartnerName: true,
        businessPartnerCategory: true,
        lanNumber: true,
        membershipFees: true,
        brokerDetails: true,
        loanApiIntegration: true,
        policyBookingDate: true,
        locationCode: true,
        plan: true,
      },
    });

    // ✅ Handle dealer not found
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer, { status: 200 });
  } catch (error) {
    console.error("[GET_DEALER_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch dealer" }, { status: 500 });
  }
}
