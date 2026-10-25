import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/api/config";

/**
 * Optimistic check only: without an admin cookie there is no point rendering the dashboard shell.
 * The real check happens in the admin layout (and the backend enforces it on every request).
 */
export function proxy(req: NextRequest) {
  if (!req.cookies.has(ADMIN_COOKIE)) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (req.nextUrl.pathname === "/admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
