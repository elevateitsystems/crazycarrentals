import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, cookieOptions, isSameOrigin, verifyAdmin } from "@/lib/server/admin-session";

function fail(status: number, message: string, clearCookie = false) {
  const res = NextResponse.json({ success: false, message }, { status });
  if (clearCookie) res.cookies.delete(ADMIN_COOKIE);
  return res;
}

/** Current admin session: re-verified against the backend on every call. No cookie is simply "not signed in". */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ success: true, data: { user: null } });
  const verified = await verifyAdmin(token);
  if (!verified.ok) return fail(verified.status, verified.message, verified.status === 401 || verified.status === 403);
  return NextResponse.json({ success: true, data: { user: verified.user } });
}

/**
 * Moves the token from an ADMIN login (made by the shared sign-in form) into the httpOnly cookie.
 * The cookie is only set once the backend has accepted that token for an admin-only endpoint.
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site request rejected.");
  let token = "";
  try {
    const body = await req.json();
    token = typeof body?.token === "string" ? body.token : "";
  } catch {}
  if (!token) return fail(400, "A login token is required.");

  const verified = await verifyAdmin(token);
  if (!verified.ok) return fail(verified.status, verified.message);

  const res = NextResponse.json({ success: true, data: { user: verified.user } });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions(token));
  return res;
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site request rejected.");
  const res = NextResponse.json({ success: true, message: "Signed out." });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
