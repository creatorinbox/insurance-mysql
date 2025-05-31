import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
    try{
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
} catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[customers_GET_ERROR]", err?.message || error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
  }