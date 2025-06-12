import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // ✅ Extract user token
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();
    
    if (!token) {
      return redirect("/signin");
    }

    // ✅ Decode the token and get user ID
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = user.id;

    const today = new Date();

    // ✅ Find expired policies for the specific user
    const expiredPolicies = await prisma.insurance.findMany({
      where: {
        expiryDate: { lte: today },
        policyStatus: { not: "Expired" },
        userId: userId, // ✅ Add user filter
      },
    });

    if (expiredPolicies.length === 0) {
      return NextResponse.json({ success: true, message: "No expired policies found for this user." });
    }

    // ✅ Update status of expired policies for the user
    await prisma.insurance.updateMany({
      where: {
        id: { in: expiredPolicies.map((p) => p.id) },
        userId: userId, // ✅ Ensure update affects only the user's policies
      },
      data: { policyStatus: "Expired" },
    });

    return NextResponse.json({ success: true, updatedCount: expiredPolicies.length });
  } catch (error) {
    console.error("Error updating expired policies:", error);
    return NextResponse.json({ success: false, error: "Failed to update policies." }, { status: 500 });
  }
}