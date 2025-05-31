import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//import { cookies } from "next/headers";

import jwt from "jsonwebtoken";
interface JwtPayload {
  id: string;
  role: string;
  // any other fields you embed in the token
}
export async function POST(req: NextRequest) {
  try {
   const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
      
        if (!token) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
      
        let user: { id: string; role: string };
        try {
          user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch {
          return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }
    const body = await req.json();

    const distributor = await prisma.distributor.create({
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        address: body.address,
        city: body.city,
        state: body.state,
        pinCode: body.pinCode,
        gstNumber: body.gstNumber,
        contactPerson: body.contactPerson,
        contactMobile: body.contactMobile,
        region: body.region,
        active: true,
        password:body.password,
        status:"ACTIVE",
        userId:user.id,
        plan:body.planId,
        updatedAt: new Date(), // ✅ Manually added
      },
    });

    return NextResponse.json(distributor, { status: 201 });
  } catch (error) {
    console.error("[CREATE_DISTRIBUTOR_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try{
  const distributor = await prisma.distributor.findMany();
  return NextResponse.json(distributor);
} catch (error: unknown) {
  const err = error as { message?: string };
  console.error("[distributor_GET_ERROR]", err?.message || error);
  return NextResponse.json(
    { error: "Failed to fetch distributor" },
    { status: 500 }
  );
}
}