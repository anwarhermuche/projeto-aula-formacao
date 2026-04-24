import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { getMiddlewareAction } from "@/lib/middleware-utils";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role ?? null;

  const action = getMiddlewareAction(pathname, role);

  if (action === "allow") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = action.redirect;
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/admin/:path*", "/treinar/:path*"],
};
