// src/app/api/payments/history/route.ts
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// export async function GET() {
//   try {
//     const user = await getUserFromToken();
//     if (!user || user.role !== "DISTRIBUTOR") {
//           return redirect("/signin");

//       //return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const history = await prisma.payment.findMany({
//       where: { dealerId: parseInt(user.id,10) },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(history);
//   } catch (error) {
//     console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "DISTRIBUTOR") {
      return redirect("/signin");
    }

    // Get all dealers created by this distributor
    const dealers = await prisma.dealer.findMany({
      where: { userId: parseInt(user.id, 10) },
      select: { id: true },
    });

    const dealerIds = dealers.map((dealer) => dealer.id);

    const history = await prisma.payment.findMany({
      where: {
        dealerId: { in: dealerIds }, // 🔍 filter payments made by those dealers
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("[GET_PAYMENT_HISTORY_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
