import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
     const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();
    
        if (!token) {
                     return redirect("/signin");
    
        //  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
    const { policyId, status } = await req.json();

    await prisma.insurance.update({
      where: { id: policyId },
      data: { policyStatus: status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Policy Status Update Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update policy status." }, { status: 500 });
  }
}