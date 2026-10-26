"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import BrandLoader from "@/components/BrandLoader";
import { useAuth } from "@/lib/auth";

/** Client-side guard for customer pages. Admin pages use AdminGuard. The backend still enforces authorisation. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(`/auth/signin?next=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return <BrandLoader label={status === "loading" ? "Checking your session…" : "Redirecting to sign in…"} />;
  }
  return <>{children}</>;
}
