import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";


interface JwtPayload {
  id: string;
  role: string;
}

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return redirect("/signin");
   //return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let user: JwtPayload;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  if (user.role !== "DISTRIBUTOR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // 1. Get all dealers created by this distributor
  const dealers = await prisma.dealer.findMany({
    where: { userId:parseInt(user.id,10)  },
    select: { dealerName: true, id: true },
  });

  const dealerIds = dealers.map((d) => d.id);

  // 2. Group insurance data by userId (dealer id) for these dealers
 const grouped = await prisma.insurance.groupBy({
  by: ["userId"],
  where: {
    userId: { in: dealerIds },
  },
  _sum: {
    invoiceAmount: true,
    dueamount: true,
  },
});
  // 3. Map grouped insurance sums back to dealer names
  const result = grouped.map((item) => {
    const dealer = dealers.find((d) => d.id === item.userId);
    return {
      dealerName: dealer?.dealerName || "Unknown",
      salesAmount: item._sum.invoiceAmount ?? 0,
      dueAmount: item._sum.dueamount ?? 0,
    };
  });

  return NextResponse.json(result);
}
