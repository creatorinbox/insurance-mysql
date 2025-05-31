import { prisma } from "@/lib/prisma";
import PlanPageClient from "@/components/PlanPageClient";

export default async function Page() {
  const rawPlans = await prisma.plan.findMany({
    include: { tiers: true },
  });

  // Only allow DEALER or DISTRIBUTOR roles
  const filteredPlans = rawPlans.filter(
    (plan) => plan.role === "DEALER" || plan.role === "DISTRIBUTOR"
  ).map((plan) => ({
    ...plan,
    // Ensure the role type matches the PlanPageClient prop type
    role: plan.role as "DEALER" | "DISTRIBUTOR",
  }));

  return <PlanPageClient plans={filteredPlans} />;
}
