"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard, { authInput, authLabel } from "@/components/AuthCard";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Customers only: the form sends no role, and the returned token + user start the customer session.
      await register(name, email, password);
      router.replace("/my-bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create an account"
      description="Register to track and manage your bookings."
      footer={
        <p>
          Already registered?{" "}
          <Link href="/auth/signin" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <div className="space-y-2">
          <Label htmlFor="name" className={authLabel}>Full name</Label>
          <Input id="name" name="name" autoComplete="name" className={authInput} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className={authLabel}>Email Address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" className={authInput} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={authLabel}>Password</Label>
          <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" className={authInput} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm" className={authLabel}>Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" className={authInput} required />
        </div>
        <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full rounded-xl text-sm font-semibold">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
