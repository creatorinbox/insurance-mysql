import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/customer/[id] → fetch a single customer
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id,10) },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[CUSTOMER_GET]", error);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

// PUT /api/customer/[id] → update customer info
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        title: body.title,
        customerName: body.customerName,
        mobile: body.mobile,
        address1: body.address1,
        address2: body.address2,
        address3: body.address3,
        city: body.city,
        state: body.state,
        postCode: body.postCode,
        email: body.email,
        kyc: body.kyc,
        dateOfBirth: new Date(body.dateOfBirth),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[CUSTOMER_PUT]", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}