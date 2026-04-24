export function getMiddlewareAction(
  pathname: string,
  role: string | null
): "allow" | { redirect: string } {
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isSellerRoute =
    pathname === "/treinar" || pathname.startsWith("/treinar/");

  if (!isAdminRoute && !isSellerRoute) return "allow";

  if (!role) return { redirect: "/login" };

  if (isAdminRoute && role !== "ADMIN") {
    return { redirect: "/treinar" };
  }

  if (isSellerRoute && role !== "SELLER") {
    return { redirect: "/admin" };
  }

  return "allow";
}
