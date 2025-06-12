import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { v4 as uuidv4 } from "uuid"; // Import UUID for uniqueness
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "DISTRIBUTOR") {
     return redirect("/signin");
      //return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const { base, amount, paymentMode, referenceNumber, remarks, discount, dealerIds } = data;

    if (!amount || !paymentMode || !referenceNumber || !discount || !dealerIds || !Array.isArray(dealerIds)) {
      return NextResponse.json({ error: "Missing fields or invalid dealer list" }, { status: 400 });
    }
const invoiceNumber = `INV-${Date.now()}-${uuidv4().slice(0, 8)}`;

    // ✅ Batch Insert Payments for Multiple Dealers
    await prisma.payment.createMany({
      data: dealerIds.map((dealerId: number) => ({
        dealerId,
        amount: parseFloat(amount) / dealerIds.length, // Split payment across dealers if needed
        baseAmount: parseFloat(base) / dealerIds.length,
        discount: parseFloat(discount) / dealerIds.length,
        paymentMode,
        referenceNumber,
        remarks,
        status: "PAID",
        invoiceNumber,

      })),
    });

    // ✅ Bulk Update Insurance Records
    await prisma.insurance.updateMany({
      where: {
        userId: { in: dealerIds }, // ✅ Update multiple dealers at once
        paidstatus: { not: "PAID" },
      },
      data: {
        dueamount: 0,
        paidstatus: "PAID",
        policyStatus:"Under Review",

      },
    });

    return NextResponse.json({ success: true, message: "Bulk manual payment processed successfully." });
  } catch (error) {
    console.error("[MANUAL_BULK_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to record bulk manual payment" },
      { status: 500 }
    );
  }
}
