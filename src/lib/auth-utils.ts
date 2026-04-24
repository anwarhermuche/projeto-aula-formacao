import type { PrismaClient } from "@/generated/prisma/client";
import type { Role } from "@/generated/prisma/enums";
import bcrypt from "bcryptjs";

export async function authorize(
  prisma: PrismaClient,
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function redirectByRole(role: Role): string {
  return role === "ADMIN" ? "/admin" : "/treinar";
}
