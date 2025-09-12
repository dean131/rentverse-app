import { PrismaClient } from "@prisma/client";

// This prevents Prisma Client from being instantiated multiple times in development
// due to Next.js/Vite hot-reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
