import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

interface SidebarLink {
  href: string;
  label: string;
}

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vendedores", label: "Vendedores" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/personas", label: "Personas" },
  { href: "/admin/sessoes", label: "Sessoes" },
  { href: "/admin/leaderboard", label: "Leaderboard" },
];

const sellerLinks: SidebarLink[] = [
  { href: "/treinar", label: "Treinar" },
  { href: "/treinar/historico", label: "Historico" },
  { href: "/treinar/leaderboard", label: "Leaderboard" },
];

export async function Sidebar() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const links = role === "ADMIN" ? adminLinks : sellerLinks;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-sidebar">
      <div className="p-6">
        <h1 className="font-heading text-lg font-bold tracking-tight">
          SalesCoach
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {role === "ADMIN" ? "Painel Admin" : "Area do Vendedor"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="mb-2 truncate text-sm font-medium">
          {session.user.name}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
