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
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "ADMIN",
    },
  });
  await prisma.user.create({
    data: {
      name: "Seller User",
      email: "seller@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "SELLER",
    },
  });
});

describe("authorize", () => {
  it("returns user with role for valid admin credentials", async () => {
    const { authorize } = await import("@/lib/auth-utils");
    const result = await authorize(prisma, "admin@test.com", "correct-password");

    expect(result).not.toBeNull();
    expect(result!.email).toBe("admin@test.com");
    expect(result!.role).toBe("ADMIN");
    expect(result!.id).toBeDefined();
    expect(result!.name).toBe("Admin User");
  });

  it("returns user with role for valid seller credentials", async () => {
    const { authorize } = await import("@/lib/auth-utils");
    const result = await authorize(prisma, "seller@test.com", "correct-password");

    expect(result).not.toBeNull();
    expect(result!.role).toBe("SELLER");
  });

  it("returns null for wrong password", async () => {
    const { authorize } = await import("@/lib/auth-utils");
    const result = await authorize(prisma, "admin@test.com", "wrong-password");

    expect(result).toBeNull();
  });

  it("returns null for non-existent email", async () => {
    const { authorize } = await import("@/lib/auth-utils");
    const result = await authorize(prisma, "nobody@test.com", "any-password");

    expect(result).toBeNull();
  });
});

describe("redirectByRole", () => {
  it("returns /admin for ADMIN role", async () => {
    const { redirectByRole } = await import("@/lib/auth-utils");
    expect(redirectByRole("ADMIN")).toBe("/admin");
  });

  it("returns /treinar for SELLER role", async () => {
    const { redirectByRole } = await import("@/lib/auth-utils");
    expect(redirectByRole("SELLER")).toBe("/treinar");
  });
});
