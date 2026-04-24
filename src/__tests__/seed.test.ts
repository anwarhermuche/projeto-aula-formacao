import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("seed", () => {
  it("creates an admin user with hashed password", async () => {
    const { seed } = await import("@/lib/seed");
    await seed(prisma);

    const admin = await prisma.user.findUnique({
      where: { email: "admin@salescoach.com" },
    });

    expect(admin).not.toBeNull();
    expect(admin!.name).toBe("Admin");
    expect(admin!.role).toBe("ADMIN");
    expect(admin!.passwordHash).not.toBe("admin123");
    expect(await bcrypt.compare("admin123", admin!.passwordHash)).toBe(true);
  });

  it("is idempotent - does not duplicate admin on re-run", async () => {
    const { seed } = await import("@/lib/seed");
    await seed(prisma);
    await seed(prisma);

    const admins = await prisma.user.findMany({
      where: { email: "admin@salescoach.com" },
    });

    expect(admins).toHaveLength(1);
  });
});
