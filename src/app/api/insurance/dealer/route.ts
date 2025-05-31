import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
  } catch  {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  // only allow DEALER access
  if (payload.role !== "DEALER") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const insurances = await prisma.insurance.findMany({
    where: { dealerName: payload.id },
    select: {
      id: true,
      productName: true,
      dealerName: true,
      invoiceAmount: true,
      dueamount: true,
      paidstatus: true,
    },
  });

  return NextResponse.json(insurances);
}
