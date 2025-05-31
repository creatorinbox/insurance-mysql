import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { mobile },
    });

    if (customer) {
      return NextResponse.json({ exists: true, customer: customer });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Error in customer search route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
