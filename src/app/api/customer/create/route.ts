import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
interface JwtPayload {
  id: number;
  role: string;
  // any other fields you embed in the token
}
export async function POST(req: NextRequest) {
  try {
    // Extract token from cookie header manually
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    let user: { id: number; role: string };
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // Parse payload safely
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const {
      title,
      customerName,
      mobile,
      email,
      address1,
      city,
      state,
      postCode,
      kyc,
      dateOfBirth,
    } = payload;

    // Validate unique mobile
    const existing = await prisma.customer.findUnique({
      where: { mobile },
    });

    if (existing) {
      return NextResponse.json({ error: "Mobile number already exists" }, { status: 409 });
    }
    // Validate unique mobile
    const existingemail = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingemail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    const newCustomer = await prisma.customer.create({
      data: {
        title,
        customerName,
        mobile,
        email,
        address1,
        city,
        state,
        postCode,
        kyc,
        dateOfBirth: new Date(dateOfBirth),
        userId: user.id,
        status: "ACTIVE",
        updatedAt:new Date(),
      },
    });

    return NextResponse.json({ customer: newCustomer }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
