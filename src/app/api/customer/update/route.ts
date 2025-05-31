import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const {
      mobile, // Unique identifier
      title,
      customerName,
      email,
      address1,
      city,
      state,
      postCode,
      kyc,
      dateOfBirth,
    } = payload;

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { mobile },
    });

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { mobile },
      data: {
        title,
        customerName,
        email,
        address1,
        city,
        state,
        postCode,
        kyc,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : '',
      },
    });

    return NextResponse.json({ customer: updatedCustomer }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
