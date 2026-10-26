"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import AuthField from "@/components/AuthField";
import { Notice } from "@/components/Feedback";
import { Lock, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      title="Create your account"
      description="Book faster and keep every rental in one place."
      footer={
        <p>
          Already registered?{" "}
          <Link href="/auth/signin" className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <Notice>{error}</Notice>}
        <AuthField id="name" label="Full name" icon={UserRound} autoComplete="name" />
        <AuthField id="email" label="Email address" icon={Mail} type="email" autoComplete="email" />
        <AuthField id="password" label="Password" icon={Lock} type="password" minLength={8} autoComplete="new-password" />
        <AuthField id="confirm" label="Confirm password" icon={Lock} type="password" minLength={8} autoComplete="new-password" />
        <Button type="submit" loading={submitting} className="mt-2 h-12 w-full rounded-xl text-[15px] font-semibold">
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
