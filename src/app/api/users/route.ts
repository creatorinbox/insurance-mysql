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
          if (user.role !== "SUPERADMIN") {
  return NextResponse.json({ message: "Access denied" }, { status: 403 });
}
        } catch {
          
          return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }
    const body = await req.json();

    const superadmin = await prisma.superadmin.create({
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
        updatedAt: new Date(), // ✅ Manually added
      },
    });
await prisma.userMeta.create({
      data: {
         role: 'SUPERADMIN',
      roleId: superadmin.id,
      name: superadmin.name,
      email: superadmin.email,
      city:superadmin.city,
      state:superadmin.state,
      pincode:superadmin.pinCode,
password:superadmin.password,
updatedAt:new Date(),

          },
    });
    return NextResponse.json(superadmin, { status: 201 });
  } catch (error) {
    console.error("[CREATE_superadmin_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try{
  const superadmin = await prisma.superadmin.findMany();
  return NextResponse.json(superadmin);
} catch (error: unknown) {
  const err = error as { message?: string };
  console.error("[superadmin_GET_ERROR]", err?.message || error);
  return NextResponse.json(
    { error: "Failed to fetch superadmin" },
    { status: 500 }
  );
}
}