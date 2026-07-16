import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const adapter = process.env.DATABASE_URL ? new PrismaPg({ connectionString: process.env.DATABASE_URL }) : undefined;
export const prisma = globalForPrisma.prisma ?? (adapter ? new PrismaClient({ adapter }) : null);
if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
