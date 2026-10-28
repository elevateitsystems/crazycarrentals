"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Lock, ShieldCheck } from "lucide-react";
import { Notice, Spinner } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBusy } from "@/hooks/use-busy";
import { bookingsApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingReference, latestPayment, type BookingData } from "@/lib/booking";
import { money } from "@/lib/format";
import { getStripe, pendingPayment } from "@/lib/stripe";

type Props = {
  booking: Booking;
  clientSecret: string;
  data: BookingData;
  carId: string;
  onPaid: (booking: Booking) => void;
  /** The hold was cancelled or expired; go back to choosing how to pay. */
  onReset: () => void;
};

const appearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: { colorPrimary: "#8BD62F", colorText: "#111512", borderRadius: "8px", fontFamily: "Manrope, system-ui, sans-serif" },
};

/** Card form for a PAY_NOW booking: Stripe collects the card; the backend verifies the payment before confirming. */
export default function CardPayment(props: Props) {
  const [attempt, setAttempt] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const stripe = useMemo(
    () =>
      getStripe().catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Could not load the payment form.");
        return null;
      }),
    // a new attempt builds a new promise (and remounts <Elements>, whose `stripe` prop can't change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attempt],
  );

  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-sm">
      <CardContent className="p-6 sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Secure card payment</h2>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
          Booking {bookingReference(props.booking)} is held for you while you pay. Card details go straight to Stripe and never reach our servers.
        </p>
        {loadError ? (
          <div className="mt-6 space-y-3">
            <Notice>{loadError}</Notice>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLoadError(null);
                  setAttempt((a) => a + 1);
                }}
              >
                Try again
              </Button>
              <CancelHold {...props} label="Cancel booking" />
            </div>
          </div>
        ) : (
          <Elements key={attempt} stripe={stripe} options={{ clientSecret: props.clientSecret, appearance }}>
            <CheckoutForm {...props} />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function CheckoutForm({ booking, data, carId, onPaid, onReset }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [guard, paying] = useBusy(); // blocks a second charge attempt while one is in flight
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  // Set when Stripe took the payment but the backend hasn't confirmed the booking yet: never charge again.
  const [paidIntentId, setPaidIntentId] = useState<string | null>(null);

  const now = useNow(1000);
  const expiresAt = booking.holdExpiresAt ? new Date(booking.holdExpiresAt).getTime() : null;
  const msLeft = expiresAt === null ? null : expiresAt - now;
  const expired = msLeft !== null && msLeft <= 0 && !paidIntentId;
  const amount = latestPayment(booking)?.amount ?? booking.totalPrice;
  const email = booking.bookingPersonDetails?.[0]?.email ?? data.email;

  const finish = async (paymentIntentId: string) => {
    setPaidIntentId(paymentIntentId);
    try {
      const res = await bookingsApi.confirmPayment(booking.id, { email, stripePaymentIntentId: paymentIntentId });
      pendingPayment.clear();
      onPaid(res.data);
    } catch (err) {
      setError(
        `Your payment went through, but we couldn't confirm the booking automatically (${err instanceof Error ? err.message : "server error"}). ` +
          `Please try again below, or contact us quoting ${bookingReference(booking)} — you won't be charged twice.`,
      );
    }
  };

  const pay = () =>
    guard(async () => {
    if (!stripe || !elements || expired) return;
    setError(null);
    try {
      if (paidIntentId) {
        await finish(paidIntentId);
        return;
      }
      // Needed only if the customer's bank sends them away to authenticate (see /book/payment-return).
      pendingPayment.save({ bookingId: booking.id, email, carId, reference: booking.bookingReference });
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: `${window.location.origin}/book/payment-return` },
      });
      if (stripeError) {
        // Card declined, failed authentication or incomplete details: the hold stays, so they can retry.
        setError(stripeError.message ?? "Your payment could not be processed. Please try again.");
      } else if (paymentIntent?.status === "succeeded") {
        await finish(paymentIntent.id);
      } else if (paymentIntent?.status === "processing") {
        setProcessing(true);
      } else {
        setError("The payment was not completed. Please try again or use a different card.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while paying. Please try again.");
    }
    });

  if (processing) {
    return (
      <Notice kind="info" className="mt-6">
        Your payment is still processing with your bank. Your booking ({bookingReference(booking)}) will be confirmed once it clears; we&apos;ll email {email}.
      </Notice>
    );
  }

  if (expired) {
    return (
      <div className="mt-6 space-y-3">
        <Notice>Your 30-minute hold on this vehicle has expired, so no payment was taken. Please start the payment again.</Notice>
        <Button onClick={onReset}>Start again</Button>
      </div>
    );
  }

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void pay();
      }}
    >
      {msLeft !== null && !paidIntentId && (
        <Notice kind="info">
          Your vehicle is held for another {Math.floor(msLeft / 60000)}:{String(Math.floor((msLeft % 60000) / 1000)).padStart(2, "0")}.
        </Notice>
      )}

      <div className={paidIntentId ? "pointer-events-none opacity-50" : undefined}>
        {!ready && <Spinner label="Loading secure payment form…" className="p-0" />}
        <PaymentElement
          onReady={() => setReady(true)}
          onLoadError={(e) => setError(e.error.message ?? "Could not load the payment form.")}
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: [data.firstName, data.lastName].filter(Boolean).join(" "),
                email,
                phone: data.phone,
                address: { line1: data.street, city: data.suburb, state: data.state, postal_code: data.postcode, country: "AU" },
              },
            },
          }}
        />
      </div>

      {error && <Notice>{error}</Notice>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {paidIntentId ? <span /> : <CancelHold booking={booking} data={data} onReset={onReset} label="Cancel booking" disabled={paying} />}
        <Button type="submit" loading={paying} disabled={!stripe || !elements || !ready} className="h-12 gap-2 rounded-xl px-7 text-[15px] font-semibold">
          {!paying && <Lock size={12} />}
          {paying ? "Processing…" : paidIntentId ? "Confirm my booking" : `Pay ${money(amount)}`}
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" />
        Payments are processed by Stripe. Your bank may ask you to verify the payment.
      </p>
    </form>
  );
}

/** Releases the hold (guests are identified by the booking email). */
function CancelHold({ booking, data, onReset, label, disabled }: Pick<Props, "booking" | "data" | "onReset"> & { label: string; disabled?: boolean }) {
  const [guard, busy] = useBusy();
  const [error, setError] = useState<string | null>(null);
  const email = booking.bookingPersonDetails?.[0]?.email ?? data.email;

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        loading={busy}
        className="h-11 rounded-xl px-5 text-sm"
        onClick={() =>
          guard(async () => {
            setError(null);
            try {
              await bookingsApi.cancel(booking.id, { email, reason: "Cancelled by customer before payment" });
              pendingPayment.clear();
              onReset();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not cancel the booking.");
            }
          })
        }
      >
        {busy ? "Cancelling…" : label}
      </Button>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
