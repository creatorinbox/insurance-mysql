import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// Use a global cached instance in dev to prevent too many connections
export const prisma =  new PrismaClient();

// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();