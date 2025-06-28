import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
                 return redirect("/signin");

    //  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserFromToken();
    if (!user) return redirect("/signin");
 const userId = parseInt(user.id, 10);
    const result = await prisma.superadmin.findFirst({
      where: { id: userId },
      select: { brokerDetails: true },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
      const err = error as { message?: string };
      console.error("[superadmin_GET_ERROR]", err?.message || error);
      return NextResponse.json(
        { error: "Failed to fetch policies" },
        { status: 500 }
      );
    }
}
export async function PATCH(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const brokerDetails = body.brokerDetails?.trim();

    if (!brokerDetails) {
      return NextResponse.json({ error: "Broker details required" }, { status: 400 });
    }

    const updated = await prisma.superadmin.update({
      where: { id: parseInt(user.id) },
      data: { brokerDetails },
    });

    return NextResponse.json({ message: "Updated", brokerDetails: updated.brokerDetails });
  } catch (error) {
    console.error("[BROKER_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update broker details" }, { status: 500 });
  }
}
