"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { Notice, Spinner } from "@/components/Feedback";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { bookingsApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingReference } from "@/lib/booking";
import { money } from "@/lib/format";
import { pendingPayment } from "@/lib/stripe";
import { cn } from "@/lib/utils";

type Outcome =
  | { kind: "working" }
  | { kind: "paid"; booking: Booking }
  | { kind: "processing"; reference?: string }
  | { kind: "failed"; message: string; carId?: string }
  | { kind: "unconfirmed"; message: string; reference?: string };

/**
 * Stripe sends the customer here only when their payment method needed a redirect (e.g. bank authentication).
 * The booking id and email were saved before leaving; the backend re-checks the PaymentIntent with Stripe.
 */
function PaymentReturn() {
  const params = useSearchParams();
  const intentId = params.get("payment_intent");
  const redirectStatus = params.get("redirect_status");
  const [outcome, setOutcome] = useState<Outcome>({ kind: "working" });

  useEffect(() => {
    let cancelled = false;
    async function finish() {
      const pending = pendingPayment.read();
      if (!pending || !intentId) {
        await Promise.resolve();
        if (!cancelled) setOutcome({ kind: "failed", message: "We couldn't find the booking this payment belongs to. If you were charged, please contact us." });
        return;
      }
      if (redirectStatus === "succeeded") {
        try {
          const res = await bookingsApi.confirmPayment(pending.bookingId, { email: pending.email, stripePaymentIntentId: intentId });
          pendingPayment.clear();
          if (!cancelled) setOutcome({ kind: "paid", booking: res.data });
        } catch (err) {
          if (!cancelled)
            setOutcome({
              kind: "unconfirmed",
              reference: pending.reference,
              message: err instanceof Error ? err.message : "The booking could not be confirmed automatically.",
            });
        }
      } else if (redirectStatus === "processing") {
        pendingPayment.clear();
        if (!cancelled) setOutcome({ kind: "processing", reference: pending.reference });
      } else {
        // Failed or abandoned: release the hold so the dates can be booked again.
        await bookingsApi.cancel(pending.bookingId, { email: pending.email, reason: "Card payment was not completed" }).catch(() => {});
        pendingPayment.clear();
        if (!cancelled) setOutcome({ kind: "failed", carId: pending.carId, message: "Your payment wasn't completed, so no booking was made and you haven't been charged." });
      }
    }
    void finish();
    return () => {
      cancelled = true;
    };
  }, [intentId, redirectStatus]);

  if (outcome.kind === "working") return <Spinner label="Confirming your payment…" className="min-h-[50vh]" />;

  const ok = outcome.kind === "paid" || outcome.kind === "processing";
  return (
    <Card className="mx-auto max-w-lg rounded-2xl border-border shadow-sm">
      <CardContent className="space-y-5 p-8 text-center">
        <span
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-full border-2",
            ok ? "border-primary text-primary" : "border-destructive text-destructive",
          )}
        >
          {ok ? <Check size={24} strokeWidth={2.5} /> : <X size={24} strokeWidth={2.5} />}
        </span>

        {outcome.kind === "paid" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Payment received</h1>
            <p className="text-sm text-muted-foreground">
              Booking <span className="font-semibold text-foreground">{bookingReference(outcome.booking)}</span> is confirmed and your card
              payment of {money(outcome.booking.totalPrice)} has been received. The details are on their way by email.
            </p>
          </>
        )}
        {outcome.kind === "processing" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Payment processing</h1>
            <p className="text-sm text-muted-foreground">
              Your bank is still processing the payment for booking {outcome.reference ?? ""}. We&apos;ll confirm it by email once it clears.
            </p>
          </>
        )}
        {outcome.kind === "failed" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">Payment not completed</h1>
            <Notice>{outcome.message}</Notice>
          </>
        )}
        {outcome.kind === "unconfirmed" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">We&apos;re confirming your booking</h1>
            <Notice>
              Your payment went through, but the booking couldn&apos;t be confirmed automatically ({outcome.message}). Our team will confirm it — please quote{" "}
              {outcome.reference ?? "your booking reference"} if you contact us. You won&apos;t be charged twice.
            </Notice>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-2.5">
          {outcome.kind === "failed" && outcome.carId && (
            <Link href={`/book/${outcome.carId}`} className={cn(buttonVariants(), "h-9 px-5 text-xs font-semibold")}>
              Try again
            </Link>
          )}
          <Link href="/" className={cn(buttonVariants({ variant: outcome.kind === "failed" ? "outline" : "default" }), "h-9 px-5 text-xs")}>
            Back to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentReturnPage() {
  return (
    <main className="min-h-[70vh] bg-background px-6 py-16">
      <Suspense fallback={<Spinner label="Confirming your payment…" />}>
        <PaymentReturn />
      </Suspense>
    </main>
  );
}
