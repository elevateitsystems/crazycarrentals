import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Notice } from "@/components/Feedback";
import type { StepProps } from "@/lib/booking";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import FormField from "./FormField";
import StepCard from "./StepCard";

const methods = ["Credit Card", "Debit Card"] as const;

const trust = ["Encrypted connection", "Card details are never stored by us", "Payments processed by Stripe"];

type Props = StepProps & {
  total?: number;
  /** Set when the price check says the car can't be booked for these dates. */
  unavailable?: string | null;
  submitting: boolean;
  error: string | null;
  needsLogin: boolean;
};

export default function PaymentStep({ total, unavailable, submitting, error, needsLogin, data, update, onNext, onBack }: Props) {
  const payNow = data.paymentTiming === "payNow";
  const pathname = usePathname();

  return (
    <StepCard
      title="Payment"
      description="Choose when to pay. Your booking is created when you continue."
      nextLabel={payNow ? (total != null ? `Continue to pay ${money(total)}` : "Continue to payment") : "Reserve Now, Pay Later"}
      onSubmit={unavailable ? () => {} : onNext}
      onBack={onBack}
      submitting={submitting}
      error={unavailable ?? error}
      footerNote={
        needsLogin && (
          <span className="mt-1 block">
            <Link href={`/auth/signin?next=${encodeURIComponent(pathname)}`} className="font-semibold underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/auth/register" className="font-semibold underline">
              create an account
            </Link>{" "}
            in this browser, then try again.
          </span>
        )
      }
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => update({ paymentTiming: "payNow" })}
          className={cn(
            "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
            payNow ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Pay Now</span>
            {payNow && <span className="size-2 rounded-full bg-primary" />}
          </div>
          <span className="text-xs text-muted-foreground">Pay online by card and get the Pay Now discount.</span>
        </button>
        <button
          type="button"
          onClick={() => update({ paymentTiming: "payDesk" })}
          className={cn(
            "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
            !payNow ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Pay at Desk</span>
            {!payNow && <span className="size-2 rounded-full bg-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground">Pay when you collect the vehicle.</span>
        </button>
      </div>

      {payNow ? (
        <>
          <div className="flex gap-2">
            {methods.map((method) => {
              const active = data.paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ paymentMethod: method })}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg border bg-card px-4 text-[11px] font-medium transition",
                    active ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {active && <span className="size-1.5 rounded-full bg-foreground" />}
                  {method}
                </button>
              );
            })}
          </div>

          <Notice kind="info" className="mt-4">
            Your vehicle is held for 30 minutes while you enter your card on the next screen, on Stripe&apos;s secure form.
          </Notice>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-xs font-semibold text-foreground">Billing Address</h3>

            <div className="mt-4 grid gap-4">
              <FormField
                id="street"
                label="Street address"
                placeholder="123 Collins St"
                required
                value={data.street}
                onChange={(e) => update({ street: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
                <FormField
                  id="suburb"
                  label="Suburb"
                  placeholder="Hobart"
                  required
                  value={data.suburb}
                  onChange={(e) => update({ suburb: e.target.value })}
                />
                <FormField
                  id="state"
                  label="State"
                  placeholder="TAS"
                  required
                  value={data.state}
                  onChange={(e) => update({ state: e.target.value })}
                />
                <FormField
                  id="postcode"
                  label="Postcode"
                  inputMode="numeric"
                  placeholder="7000"
                  required
                  value={data.postcode}
                  onChange={(e) => update({ postcode: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Notice kind="info">Your vehicle is held for you. Payment is collected by our team at the desk on pickup.</Notice>
      )}

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {trust.map((item) => (
          <li key={item} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </StepCard>
  );
}
