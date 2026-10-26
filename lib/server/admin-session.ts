import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, API_URL } from "@/lib/api/config";
import { readUser } from "@/lib/api/services";
import type { User } from "@/lib/api/types";

/** httpOnly, so page scripts (and anything injected into them) can never read the admin token. */
export { ADMIN_COOKIE };

const FALLBACK_MAX_AGE = 60 * 60 * 12;

export function cookieOptions(token: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: tokenLifetime(token),
  };
}

/**
 * Seconds until the JWT's `exp`, used only to size the cookie so it doesn't outlive the token.
 * Nothing about *who* the user is or what they may do is read from the token; the backend decides that.
 */
function tokenLifetime(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    const left = Math.floor(Number(payload.exp) - Date.now() / 1000);
    return Number.isFinite(left) && left > 0 ? left : FALLBACK_MAX_AGE;
  } catch {
    return FALLBACK_MAX_AGE;
  }
}

export type Verified = { ok: true; user: User } | { ok: false; status: number; message: string };

async function backend(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, { ...init, cache: "no-store", headers: { Accept: "application/json", ...init.headers } });
}

async function json(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * An account counts as an admin only if the backend serves an admin-only endpoint for its token.
 * `/auth/me` supplies the profile; `/bookings/admin/summary` is the permission check (a customer token gets 403).
 */
export async function verifyAdmin(token: string): Promise<Verified> {
  const auth = { Authorization: `Bearer ${token}` };
  try {
    const me = await backend("/auth/me", { headers: auth });
    if (me.status === 401) return { ok: false, status: 401, message: "Your session has expired. Please sign in again." };
    if (!me.ok) return { ok: false, status: 502, message: "Could not verify your account with the server." };
    const user = readUser((await json(me))?.data);
    if (!user) return { ok: false, status: 502, message: "The server returned no profile for this account." };

    const probe = await backend("/bookings/admin/summary", { headers: auth });
    if (probe.status === 401) return { ok: false, status: 401, message: "Your session has expired. Please sign in again." };
    if (probe.status === 403) return { ok: false, status: 403, message: "This account does not have admin access." };
    if (!probe.ok) return { ok: false, status: 502, message: "Could not verify admin access with the server." };
    return { ok: true, user };
  } catch {
    return { ok: false, status: 502, message: "Cannot reach the server. Check your connection or the API URL." };
  }
}

/**
 * CSRF guard for cookie-authenticated writes: the request must come from this site's own pages.
 * (The cookie is also SameSite=Strict; this covers browsers or proxies that don't honour it.)
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = [req.headers.get("x-forwarded-host"), req.headers.get("host"), req.nextUrl.host].filter(Boolean);
  return allowed.includes(host);
}
