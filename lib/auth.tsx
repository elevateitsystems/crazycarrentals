"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, tokenStore } from "@/lib/api/client";
import { AUTH_EXPIRED_EVENT } from "@/lib/api/config";
import { startAdminSession } from "@/lib/admin-auth";
import { authApi } from "@/lib/api/services";
import type { User } from "@/lib/api/types";

type Status = "loading" | "authenticated" | "guest";

type AuthContextValue = {
  user: User | null;
  status: Status;
  /** Shared sign-in for every role. Resolves with the user (role as given by the backend). */
  login: (email: string, password: string) => Promise<User>;
  /** Customer sign-up: keeps the token and user the backend returns. */
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Role as reported by the backend (`data.user.role`). Decides where a login goes; access itself is granted
 * by the backend (the admin session is only created once an admin-only endpoint accepts the token).
 */
export function isAdminRole(role: unknown) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Reads `data.user` / `data.token` from a login or register response. */
function readSession(data: { user?: User; token?: string } | null | undefined) {
  const token = typeof data?.token === "string" ? data.token : null;
  if (!token) throw new Error("The server response contained no token.");
  if (!data?.user) throw new Error("The server response contained no user.");
  return { token, user: data.user };
}

/**
 * Customer session. The token lives in localStorage, so it is never allowed to hold an admin-capable token:
 * admin accounts get an httpOnly-cookie session from lib/admin-auth instead.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!tokenStore.get()) {
        setStatus("guest");
        return;
      }
      try {
        const res = await authApi.me();
        if (cancelled) return;
        if (!res.data || isAdminRole(res.data.role)) {
          // An admin token from before sessions were split: drop it rather than keep it in localStorage.
          tokenStore.clear();
          setStatus("guest");
          return;
        }
        setUser(res.data);
        setStatus("authenticated");
      } catch (err) {
        if (cancelled) return;
        // Only drop the token when the server rejected it; a network error shouldn't log the user out.
        if (err instanceof ApiError && err.status === 401) tokenStore.clear();
        setUser(null);
        setStatus("guest");
      }
    }
    load();

    const onExpired = () => {
      setUser(null);
      setStatus("guest");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    };
  }, []);

  const keepCustomer = useCallback((token: string, u: User) => {
    tokenStore.set(token);
    setUser(u);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user: u } = readSession((await authApi.login({ email, password })).data);
      // The login response carries the role; fall back to /auth/me should a backend version omit it.
      const role = u.role ?? (await authApi.me(token)).data?.role;
      if (isAdminRole(role)) {
        // Staff: the token goes to the httpOnly admin cookie, never to localStorage.
        const admin = await startAdminSession(token);
        return { ...u, ...admin, role: admin.role ?? role };
      }
      keepCustomer(token, { ...u, role });
      return { ...u, role };
    },
    [keepCustomer],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user: u } = readSession((await authApi.register({ name, email, password })).data);
      // Public sign-up only ever creates customers; refuse to keep anything else in localStorage.
      if (isAdminRole(u.role)) throw new Error("Admin accounts can't be created through registration.");
      keepCustomer(token, u);
      return u;
    },
    [keepCustomer],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, status, login, register, logout, setUser }), [user, status, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
