// app/policy-pricing/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export interface PolicyPricingInput {
  category: string;
  minAmount: number;
  maxAmount: number;
  ew1Year?: number;
  ew2Year?: number;
  ew3Year?: number;
  adld?: number;
  combo1Year?: number;
}
export async function createPolicyPricing(data:PolicyPricingInput) {
  await prisma.policyPricing.create({ data });
  revalidatePath("/policy-pricing");
}

export async function updatePolicyPricing(id: string, data: PolicyPricingInput) {
  console.log("UpdatePayload:", { id, data });

  const {
    category,
    minAmount,
    maxAmount,
    ew1Year,
    ew2Year,
    ew3Year,
    adld,
    combo1Year
  } = data;

  return await prisma.policyPricing.update({
    where: { id },
    data: {
      category,
      minAmount,
      maxAmount,
      ew1Year,
      ew2Year,
      ew3Year,
      adld,
      combo1Year,
    },
  });
}
export async function deletePolicyPricing(id: string) {
  try {
    await prisma.policyPricing.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete policy pricing:", error);
    throw error; // re-throw so caller can handle it if needed
  }
}
// export async function updatePolicyPricing(
//   id: string,
//   data: {
//     category: string;
//     minAmount: number;
//     maxAmount: number;
//     ew1Year?: number;
//     ew2Year?: number;
//     ew3Year?: number;
//     adld?: number;
//     combo1Year?: number;
//   }
// ) {
//   await prisma.policyPricing.update({ where: { id }, data });
//   revalidatePath("/policy-pricing");
// }
