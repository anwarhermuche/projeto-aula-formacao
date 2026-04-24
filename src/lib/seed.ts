import type { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

export async function seed(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: { email: "admin@salescoach.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@salescoach.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });
}
