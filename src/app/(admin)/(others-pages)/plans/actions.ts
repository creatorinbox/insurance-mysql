"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// CREATE PLAN
export async function createPlan(data: {
  name: string;
  role: "DEALER" | "DISTRIBUTOR";
  tiers: { discount: number; insuranceCount: number }[];
}) {
  await prisma.plan.create({
    data: {
      name: data.name,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      tiers: {
        create: data.tiers.map((t) => ({
          discountPercent: t.discount,
          insuranceCount: t.insuranceCount,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
    },
  });

  revalidatePath("/plans");
}

// UPDATE PLAN
export async function updatePlan(id: number, data: {
  name: string;
  role: "DEALER" | "DISTRIBUTOR";
  tiers: { discount: number; insuranceCount: number }[];
}) {
  await prisma.planTier.deleteMany({ where: { planId: id } });

  await prisma.plan.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      updatedAt: new Date(),
      tiers: {
        create: data.tiers.map((t) => ({
          discountPercent: t.discount,
          insuranceCount: t.insuranceCount,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
    },
  });

  revalidatePath("/plans");
}

// DELETE PLAN
export async function deletePlan(id: number) {
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/plans");
}
