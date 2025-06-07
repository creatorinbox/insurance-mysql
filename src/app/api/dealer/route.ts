import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
// Replace this with your real JWT secret
//const JWT_SECRET = process.env.JWT_SECRET!;
interface JwtPayload {
  id: number;
  role: string;
  // any other fields you embed in the token
}
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

   const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
   
     if (!token) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
   
     let user: { id: number; role: string };
     try {
       user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
         if (!user) {
      return NextResponse.json({ error: "Unauthorized - User missing" }, { status: 401 });
    }
     } catch {
       return NextResponse.json({ message: "Invalid token" }, { status: 403 });
     }
    const getSafeDate = (input: FormDataEntryValue | null) => {
      const value = input?.toString() || "";
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    };
    const dealer = await prisma.dealer.create({
      data: {
        salesChannel: form.get("salesChannel")?.toString() || "",
        dealerName: form.get("dealerName")?.toString() || "",
        dealerLocation: form.get("dealerLocation")?.toString() || "",
        dealerCode: form.get("dealerCode")?.toString() || "",
        vas: form.get("vas")?.toString() || "",
        businessPartnerName: form.get("businessPartnerName")?.toString() || "",
        businessPartnerCategory: form.get("businessPartnerCategory")?.toString() || "",
        lanNumber: form.get("lanNumber")?.toString() || "",
        policyBookingDate: getSafeDate(form.get("policyBookingDate"))|| new Date(),
        membershipFees: form.get("membershipFees")?.toString() || "",
        brokerDetails: form.get("brokerDetails")?.toString() || "",
        locationCode: form.get("locationCode")?.toString() || "",
        loanApiIntegration: form.get("loanApiIntegration")?.toString() || "",
       plan: parseInt(form.get("planId")?.toString() || "0", 10),
         email: form.get("email")?.toString() || "",
        password: form.get("password")?.toString() || "",
       status:"ACTIVE",
       tier:form.get("tier")?.toString() || "",
        userId:user.id,
        updatedAt:new Date(),
      },
    });

    return NextResponse.json(dealer, { status: 201 });
  } catch (error) {
    console.error("[DEALER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Dealer creation failed" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("token=")[1]
    ?.split(";")[0]
    ?.trim();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized - Token missing" }, { status: 401 });
  }

  let user: { id: number; role: string };
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!user) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
  } catch  {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
  try {
  const dealers = await prisma.dealer.findMany();
  return NextResponse.json(dealers, { status: 200 });
} catch (error: unknown) {
  const err = error as { message?: string };
  console.error("[Dealer_GET_ERROR]", err?.message || error);
  return NextResponse.json(
    { error: "Failed to fetch Dealer" },
    { status: 500 }
  );
}
  // Now continue with your logic...
}
