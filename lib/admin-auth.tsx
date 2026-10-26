"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_EXPIRED_EVENT, ADMIN_FORBIDDEN_EVENT, ADMIN_SESSION_PATH } from "@/lib/api/config";
import type { User } from "@/lib/api/types";

type Status = "loading" | "authenticated" | "guest";
/** Why the last session ended, so the sign-in page can explain it. */
export type EndReason = "expired" | "forbidden" | "signed-out" | null;

type AdminAuthValue = {
  user: User | null;
  status: Status;
  reason: EndReason;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

class SessionError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call(method: "GET" | "POST" | "DELETE", body?: unknown): Promise<User | null> {
  let res: Response;
  try {
    res = await fetch(ADMIN_SESSION_PATH, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new SessionError("Cannot reach the server. Check your connection.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new SessionError(typeof json?.message === "string" ? json.message : `Request failed (${res.status})`, res.status);
  return (json?.data?.user as User | undefined) ?? null;
}

/**
 * Hands the token from an ADMIN login to the session route, which only sets the (httpOnly) session cookie
 * if the backend accepts that token on an admin-only endpoint. The token is never kept in browser storage.
 */
export async function startAdminSession(token: string): Promise<User> {
  const user = await call("POST", { token });
  if (!user) throw new Error("The server did not return the admin profile.");
  return user;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reason, setReason] = useState<EndReason>(null);

  const end = useCallback((why: EndReason) => {
    setUser(null);
    setStatus("guest");
    setReason(why);
  }, []);

  const verify = useCallback(async () => {
    try {
      const u = await call("GET");
      setUser(u);
      setStatus(u ? "authenticated" : "guest");
      return true;
    } catch (err) {
      const code = err instanceof SessionError ? err.status : 0;
      end(code === 403 ? "forbidden" : code === 401 ? "expired" : null);
      return false;
    }
  }, [end]);

  useEffect(() => {
    let cancelled = false;
    call("GET").then(
      (u) => {
        if (cancelled) return;
        setUser(u);
        setStatus(u ? "authenticated" : "guest");
      },
      (err) => {
        if (cancelled) return;
        // A first visit without a cookie is a plain 401: that's "not signed in", not "expired".
        end(err instanceof SessionError && err.status === 403 ? "forbidden" : null);
      },
    );

    const onExpired = () => end("expired");
    // A 403 from an admin endpoint may be a revoked role; ask the server again before deciding.
    const onForbidden = () => void verify();
    window.addEventListener(ADMIN_EXPIRED_EVENT, onExpired);
    window.addEventListener(ADMIN_FORBIDDEN_EVENT, onForbidden);
    return () => {
      cancelled = true;
      window.removeEventListener(ADMIN_EXPIRED_EVENT, onExpired);
      window.removeEventListener(ADMIN_FORBIDDEN_EVENT, onForbidden);
    };
  }, [end, verify]);

  const logout = useCallback(async () => {
    try {
      await call("DELETE");
    } catch {}
    end("signed-out");
  }, [end]);

  const value = useMemo<AdminAuthValue>(() => ({ user, status, reason, logout }), [user, status, reason, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
