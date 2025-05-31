import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.policyPricing.create({
    data: {
      category: "Television",
      minAmount: 10001,
      maxAmount: 15000,
      ew1Year: 1200,
      ew2Year: 2100,
      ew3Year: 3000,
    },
  });

  console.log("✅ Policy pricing seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
