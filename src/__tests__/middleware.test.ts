import { describe, it, expect } from "vitest";

describe("getMiddlewareAction", () => {
  let getMiddlewareAction: (
    pathname: string,
    role: string | null
  ) => "allow" | { redirect: string };

  it("loads the function", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;
    expect(getMiddlewareAction).toBeDefined();
  });

  it("redirects unauthenticated user from /admin to /login", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    const result = getMiddlewareAction("/admin", null);
    expect(result).toEqual({ redirect: "/login" });
  });

  it("redirects unauthenticated user from /admin/anything to /login", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    const result = getMiddlewareAction("/admin/products", null);
    expect(result).toEqual({ redirect: "/login" });
  });

  it("redirects unauthenticated user from /treinar to /login", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    const result = getMiddlewareAction("/treinar", null);
    expect(result).toEqual({ redirect: "/login" });
  });

  it("redirects SELLER from /admin to /treinar", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    const result = getMiddlewareAction("/admin", "SELLER");
    expect(result).toEqual({ redirect: "/treinar" });
  });

  it("redirects ADMIN from /treinar to /admin", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    const result = getMiddlewareAction("/treinar", "ADMIN");
    expect(result).toEqual({ redirect: "/admin" });
  });

  it("allows ADMIN to access /admin", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    expect(getMiddlewareAction("/admin", "ADMIN")).toBe("allow");
  });

  it("allows SELLER to access /treinar", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    expect(getMiddlewareAction("/treinar", "SELLER")).toBe("allow");
  });

  it("allows unauthenticated user to access /login", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    expect(getMiddlewareAction("/login", null)).toBe("allow");
  });

  it("allows any user to access public routes", async () => {
    const mod = await import("@/lib/middleware-utils");
    getMiddlewareAction = mod.getMiddlewareAction;

    expect(getMiddlewareAction("/", null)).toBe("allow");
    expect(getMiddlewareAction("/api/auth/callback", null)).toBe("allow");
  });
});
