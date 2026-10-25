"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, { authInput, authLabel } from "@/components/AuthCard";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminRole, useAuth } from "@/lib/auth";

const isAdminPath = (p: string) => p === "/admin" || p.startsWith("/admin/");

/** Where to go after sign-in: `next` if it's a same-site page this role may open, else the role's home. */
function destination(next: string | null, admin: boolean) {
  const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  if (admin) return safe && isAdminPath(safe) ? safe : "/admin/dashboard";
  return safe && !isAdminPath(safe) ? safe : "/my-bookings";
}

const REASONS: Record<string, string> = {
  expired: "Your session has expired. Please sign in again.",
  forbidden: "This account doesn't have admin access.",
};

function SignInForm() {
  const { login, status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const reason = params.get("reason");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // A signed-in customer sent here from an admin page: say why rather than show a bare form.
  const notice =
    (reason && REASONS[reason]) ||
    (status === "authenticated" && next && isAdminPath(next) ? "You're signed in as a customer. Sign in with an admin account to open the dashboard." : null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(String(form.get("email")), String(form.get("password")));
      router.replace(destination(next, isAdminRole(user.role)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      description="Enter your credentials to manage your bookings or access the admin dashboard."
      footer={
        <>
          <p>
            <Link href="/auth/forgot-password" className="font-medium text-foreground hover:underline">
              Forgot your password?
            </Link>
          </p>
          <p>
            New here?{" "}
            <Link href="/auth/register" className="font-medium text-foreground hover:underline">
              Create an account
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <Notice>{error}</Notice> : notice ? <Notice kind="info">{notice}</Notice> : null}
        <div className="space-y-2">
          <Label htmlFor="email" className={authLabel}>Email Address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" className={authInput} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={authLabel}>Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" className={authInput} required />
        </div>
        <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full rounded-xl text-sm font-semibold">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
