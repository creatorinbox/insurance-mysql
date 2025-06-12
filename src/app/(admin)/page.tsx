import { prisma } from "@/lib/prisma";
import { getExtendedUserFromToken } from "@/lib/getExtendedUserFromToken";
import { redirect } from "next/navigation";
//import PayNowPopup from "@/components/PayNowPopup";

export default async function DashboardPage() {
  const user = await getExtendedUserFromToken();
  if (!user) redirect("/signin");
  if (user.expired) redirect("/reset-password");

  const { id: userId, role } = user;
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const isMonthEnd = lastDay.getDate() - today.getDate() <= 6;

  let invoiceTotal = 0;
  let dueTotal = 0;
  let discount = 0;
  let finalDue = 0;
  let paidAmount = 0;
  let effectiveDeduction = 0;
  let eligibleForPayment = false;
const checkAndUpdateExpiredPolicies = async () => {
  try {
    const res = await fetch("/api/insurance/check-expired-insurances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Failed to update expired policies.");
    }
  } catch (error) {
    console.error("Error checking expired policies:", error);
  }
};
  if (role === "DEALER") {
     checkAndUpdateExpiredPolicies();
    const dealer = await prisma.dealer.findUnique({ where: { id: parseInt(userId,10) } });

    if (dealer) {
      const insurances = await prisma.insurance.findMany({
        where: {
          userId: dealer.id,
          policyBookingDate: { gte: startDate, lte: lastDay },
        },
        select: { invoiceAmount: true,dueamount:true,SalesAmount:true },
      });

      for (const ins of insurances) {
        invoiceTotal += ins.SalesAmount ?? 0;
        dueTotal += ins.dueamount ?? 0;
      }

      // const payments = await prisma.payment.findMany({
      //   where: {
      //     dealerId: dealer.id,
      //     createdAt: { gte: startDate, lte: lastDay },
      //   },
      // });

      // for (const p of payments) {
      //   paidAmount += p.baseAmount;
      // }

      //dueTotal = invoiceTotal - paidAmount;
    }
  }

  if (role === "DISTRIBUTOR") {
    const dealers = await prisma.dealer.findMany({ where: { userId:parseInt(userId,10) } });
    const dealerIds = dealers.map((d) => d.id);

    const insurances = await prisma.insurance.findMany({
      where: {
        userId: { in: dealerIds },
        policyBookingDate: { gte: startDate, lte: lastDay },
      },
      select: { invoiceAmount: true ,dueamount:true,SalesAmount:true},
    });

    for (const ins of insurances) {
      invoiceTotal += ins.SalesAmount ?? 0;
      dueTotal+= ins.dueamount ?? 0;
    }

    const payments = await prisma.payment.findMany({
      where: {
        dealerId: { in: dealerIds },
        createdAt: { gte: startDate, lte: lastDay },
      },
    });

    for (const p of payments) {
      paidAmount += p.baseAmount;
    }

   paidAmount =  paidAmount;
    const insuranceCount = insurances.length;

    if (dueTotal > 0) {
      eligibleForPayment = true;

      const distributor = await prisma.distributor.findUnique({
        where: { id: parseInt(userId,10) },
      });

      if (distributor?.plan) {
       const plan = await prisma.plan.findFirst({
  where: {
    id: distributor.plan,
    role: 'DISTRIBUTOR',
  },
  include: {
    tiers: {
      orderBy: {
        insuranceCount: "desc",
      },
    },
  },
});

        const matchingTier = plan?.tiers.find(
          (tier) => tier.insuranceCount <= insuranceCount
        );

        if (matchingTier) discount = matchingTier.discountPercent;
      }

      const baseRate = 15;
      effectiveDeduction = isMonthEnd && discount > 0 ? baseRate - discount : baseRate;

      if (isMonthEnd && discount > 0) {
        const discValue = (invoiceTotal * discount) / 100;
        const adjusted = (dueTotal * baseRate) / 100;
        const diff = discValue - adjusted;
        finalDue = dueTotal - diff;
      } else {
        finalDue = dueTotal - (dueTotal * baseRate / 100);
      }
    }
  }
if (role === "SUPERADMIN") {
  const distributors = await prisma.distributor.findMany();
  for (const dist of distributors) {
    const dealers = await prisma.dealer.findMany({ where: { userId: dist.id } });
    const dealerIds = dealers.map(d => d.id);

    const payments = await prisma.payment.findMany({
      where: { dealerId: { in: dealerIds }, createdAt: { gte: startDate, lte: lastDay } },
    });

    if (payments.length > 0) {
      for (const p of payments) paidAmount += p.baseAmount;
    }
paidAmount=paidAmount;
    const insurances = await prisma.insurance.findMany({
      where: {
        userId: { in: dealerIds },
        policyBookingDate: { gte: startDate, lte: lastDay },
      },
      select: { invoiceAmount: true ,dueamount:true,SalesAmount:true},
    });

    for (const i of insurances) {
      invoiceTotal += i.SalesAmount ?? 0;
      dueTotal+= i.dueamount ?? 0;
    }

   // dueTotal = invoiceTotal - paidAmount;
  }
}
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">{role} Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-600">
            Total Monthly Sales for {today.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <p className="text-2xl font-bold text-green-700">
            ₹ {invoiceTotal.toFixed(2)}
          </p>
        </div>
{role != "SUPERADMIN" &&(
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-600">Total Due Amount</h2>
          <p className="text-2xl font-bold text-red-600">₹ {dueTotal.toFixed(2)}</p>

          {role === "DISTRIBUTOR" && eligibleForPayment && (
            <div className="mt-4 space-y-1">
              <p>Commission Rate: 15%</p>
              {isMonthEnd && discount > 0 && (
                <>
                  <p>Discount Applied: {discount}%</p>
                  <p>Effective Deduction: {effectiveDeduction}%</p>
                  <p>
                    Amount Deducted: ₹ {(dueTotal * effectiveDeduction / 100).toFixed(2)}
                  </p>
                </>
              )}
              <p className="font-semibold text-blue-700">
                Payable: ₹ {finalDue.toFixed(2)}
              </p>

              {/* <PayNowPopup
                baseAmount={+invoiceTotal.toFixed(2)}
                discount={effectiveDeduction}
                payableAmount={+finalDue.toFixed(2)}
              /> */}
            </div>
          )}
        </div>
    )} 
      </div>
    </div>
  );
}
