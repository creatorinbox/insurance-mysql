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
        userId:parseInt(user.id,10),
        plan:body.planId,
        updatedAt: new Date(), // ✅ Manually added
        note:"",
      },
    });
await prisma.userMeta.create({
      data: {
         role: 'DISTRIBUTOR',
      roleId: distributor.id,
      name: distributor.name,
      email: distributor.email,
      password:distributor.password,
      city:distributor.city,
      state:distributor.state,
      pincode:distributor.pinCode,
updatedAt:new Date(),

          },
    });
    return NextResponse.json(distributor, { status: 201 });
  } catch (error) {
    console.error("[CREATE_DISTRIBUTOR_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
// export async function POST(req: NextRequest) {
//   try {
//     const cookieHeader = req.headers.get("cookie") || "";
//     const tokenMatch = cookieHeader.match(/token=([^;]+)/);
//     const token = tokenMatch?.[1];

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     let user: { id: string; role: string };
//     try {
//       user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     } catch {
//       return NextResponse.json({ message: "Invalid token" }, { status: 403 });
//     }

//     const body = await req.json();

//     // ✅ Basic validation (optional but recommended)
//     const requiredFields = [
//       "name", "email", "mobile", "address", "city", "state",
//       "pinCode", "gstNumber", "contactPerson", "contactMobile",
//       "region", "password", "planId"
//     ];
//     const missingFields = requiredFields.filter(field => !body[field]);

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { message: `Missing fields: ${missingFields.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     const distributor = await prisma.distributor.create({
//       data: {
//         name: body.name,
//         email: body.email,
//         password: body.password,
//         mobile: body.mobile,
//         address: body.address,
//         city: body.city,
//         state: body.state,
//         pinCode: body.pinCode,
//         gstNumber: body.gstNumber,
//         contactPerson: body.contactPerson,
//         contactMobile: body.contactMobile,
//         region: body.region,
//         active: true,
//         status: "ACTIVE",
//         userId: user.id,
//         plan: body.planId,
//         updatedAt: new Date(),
//         // `createdAt` is automatically handled by Prisma
//       },
//     });

//     return NextResponse.json(distributor, { status: 201 });

//   } catch (error) {
//     console.error("[CREATE_DISTRIBUTOR_ERROR]", typeof error === 'object' ? error : { message: String(error) });
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }
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