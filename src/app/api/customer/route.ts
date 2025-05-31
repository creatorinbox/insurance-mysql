import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    const mobile = req.nextUrl.searchParams.get("mobile");
    if (!mobile) {
      return NextResponse.json({ error: "Mobile number required" }, { status: 400 });
    }
  
    try {
      const data = await prisma.insurance.findMany({
        where: { mobile },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          policyNumber: true,
          productName: true,
          membershipFees: true,
          policyStartDate: true,
          expiryDate: true,
        },
      });
  
      return NextResponse.json(data);
    } catch (error) {
      console.error("[INSURANCE_GET_ERROR]", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }