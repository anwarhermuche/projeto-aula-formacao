import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

describe("User model", () => {
  it("creates a user with all required fields", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "admin@test.com",
        passwordHash: "hashed_password_123",
        role: "ADMIN",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe("Test Admin");
    expect(user.email).toBe("admin@test.com");
    expect(user.passwordHash).toBe("hashed_password_123");
    expect(user.role).toBe("ADMIN");
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("defaults role to SELLER", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test Seller",
        email: "seller@test.com",
        passwordHash: "hashed_password_123",
      },
    });

    expect(user.role).toBe("SELLER");
  });

  it("enforces unique email", async () => {
    await prisma.user.create({
      data: {
        name: "User 1",
        email: "duplicate@test.com",
        passwordHash: "hash1",
      },
    });

    await expect(
      prisma.user.create({
        data: {
          name: "User 2",
          email: "duplicate@test.com",
          passwordHash: "hash2",
        },
      })
    ).rejects.toThrow();
  });
});
