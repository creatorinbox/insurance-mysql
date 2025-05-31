import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$connect();
    await prisma.user.findFirst(); // simple query to ensure connection
    return NextResponse.json({ status: "connected" });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json({ status: "disconnected", error: String(error) }, { status: 500 });
  }
}