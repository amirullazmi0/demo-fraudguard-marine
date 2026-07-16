import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
     const adminHash = await bcrypt.hash("Admin123!", 12);
     const abkHash = await bcrypt.hash("Abk123!", 12);
     await prisma.user.upsert({
          where: { email: "admin@marineguard.demo" },
          update: { passwordHash: adminHash, role: "ADMIN" },
          create: {
               email: "admin@marineguard.demo",
               passwordHash: adminHash,
               role: "ADMIN",
          },
     });
     await prisma.user.upsert({
          where: { email: "abk@marineguard.demo" },
          update: { passwordHash: abkHash, role: "ABK" },
          create: { email: "abk@marineguard.demo", passwordHash: abkHash, role: "ABK" },
     });
}

main().finally(() => prisma.$disconnect());

