"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard, { authInput, authLabel } from "@/components/AuthCard";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findString } from "@/lib/booking";
import { authApi } from "@/lib/api/services";

export default function ForgotPasswordPage() {
  const router = useRouter();
  // Phase 1 asks for the email; phase 2 (once the server has issued a reset id) asks for the OTP.
  const [resetId, setResetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setSubmitting(true);
    setError(null);
    try {
      const res = await authApi.forgotPassword({ email });
      // The collection documents no response for this call; the reset step needs the user id from it.
      const id = findString(res.raw, ["id", "userId"]);
      if (!id) {
        setInfo(res.message ?? "If that email is registered, a one-time code has been sent.");
        setError("The server did not return a reset reference, so the code cannot be entered here yet.");
      } else {
        setResetId(id);
        setInfo(res.message ?? "A one-time code has been sent to your email.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the password reset.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetId) return;
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      await authApi.resetPassword({ id: resetId, otp: Number(form.get("otp")), newPassword: String(form.get("password")) });
      router.replace("/auth/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      description={resetId ? "Enter the code we emailed you and choose a new password." : "We'll email you a one-time code."}
      footer={
        <Link href="/auth/signin" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      }
    >
      {resetId ? (
        <form onSubmit={reset} className="space-y-4">
          {info && <Notice kind="info">{info}</Notice>}
          {error && <Notice>{error}</Notice>}
          <div className="space-y-2">
            <Label htmlFor="otp" className={authLabel}>One-time code</Label>
            <Input id="otp" name="otp" inputMode="numeric" pattern="[0-9]*" className={authInput} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={authLabel}>New password</Label>
            <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" className={authInput} required />
          </div>
          <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full rounded-xl text-sm font-semibold">
            {submitting ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      ) : (
        <form onSubmit={requestOtp} className="space-y-4">
          {info && <Notice kind="info">{info}</Notice>}
          {error && <Notice>{error}</Notice>}
          <div className="space-y-2">
            <Label htmlFor="email" className={authLabel}>Email Address</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className={authInput} required />
          </div>
          <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full rounded-xl text-sm font-semibold">
            {submitting ? "Sending…" : "Send code"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
