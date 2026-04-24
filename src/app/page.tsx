import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { redirectByRole } from "@/lib/auth-utils";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  redirect(redirectByRole(session.user.role as "ADMIN" | "SELLER"));
}
