"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

/** Renders the dashboard only for a session the backend has verified as admin; otherwise sends to the sign-in page. */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { status, reason } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "guest") return;
    const params = new URLSearchParams({ next: pathname });
    if (reason === "expired" || reason === "forbidden") params.set("reason", reason);
    router.replace(`/auth/signin?${params}`);
  }, [status, reason, router, pathname]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        {status === "loading" ? "Verifying admin access…" : "Redirecting to sign in…"}
      </div>
    );
  }
  return <>{children}</>;
}
