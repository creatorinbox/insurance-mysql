import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const superadmin = await prisma.superadmin.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "123456", // hash if needed
      mobile: "9876543210",
      address: "123 Admin Street",
      city: "Metropolis",
      state: "StateX",
      pinCode: "123456",
      gstNumber: "GSTADMIN1234",
      contactPerson: "Jane Doe",
      contactMobile: "9876543211",
      region: "North",
      status: "ACTIVE",
    },
  });

  console.log("Superadmin created:", superadmin);
}

main()
  .catch((e) => {
    console.error("Error creating superadmin:", e);
  })
  .finally(() => prisma.$disconnect());
