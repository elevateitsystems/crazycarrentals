import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgePercent, ShieldCheck } from "lucide-react";
import { Notice } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";
import type { Estimate, StepProps } from "@/lib/booking";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import FormField from "./FormField";
import StepCard from "./StepCard";

const methods = ["Credit Card", "Debit Card"] as const;

const trust = ["Encrypted connection", "Card details are never stored by us", "Payments processed by Stripe"];

type Props = StepProps & {
  total?: number;
  estimate?: Estimate | null;
  /** Set when the price check says the car can't be booked for these dates. */
  unavailable?: string | null;
  submitting: boolean;
  error: string | null;
  needsLogin: boolean;
};

export default function PaymentStep({ total, estimate, unavailable, submitting, error, needsLogin, data, update, onNext, onBack }: Props) {
  const payNow = data.paymentTiming === "payNow";
  const pathname = usePathname();
  // The discount percentage is owned by the backend; never hardcode it here.
  const catalog = useAsync(async () => (await bookingsApi.extras()).data, "pay-now-discount");
  const percent = catalog.data?.discounts?.payNowDiscountPercent ?? (payNow ? estimate?.discountPercentage : undefined) ?? 0;
  const saving = payNow ? estimate?.discount : undefined;

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
      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => update({ paymentTiming: "payNow" })}
          className={cn(
            "flex flex-col items-start gap-1.5 rounded-2xl border-2 p-5 text-left transition",
            payNow ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-base font-semibold text-foreground">Pay Now</span>
            <span className="flex items-center gap-2">
              {percent > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  <BadgePercent className="size-3.5" aria-hidden /> Save {percent}%
                </span>
              )}
              {payNow && <span className="size-3 rounded-full bg-primary" />}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">Pay online by card{percent > 0 ? ` and save ${percent}% on your booking` : ""}.</span>
        </button>
        <button
          type="button"
          onClick={() => update({ paymentTiming: "payDesk" })}
          className={cn(
            "flex flex-col items-start gap-1.5 rounded-2xl border-2 p-5 text-left transition",
            !payNow ? "border-foreground bg-foreground/5" : "border-border hover:bg-muted"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-base font-semibold text-foreground">Pay at Desk</span>
            {!payNow && <span className="size-3 rounded-full bg-foreground" />}
          </div>
          <span className="text-sm text-muted-foreground">Pay when you collect the vehicle.</span>
        </button>
      </div>

      {payNow ? (
        percent > 0 && (
          <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5 text-sm">
            <BadgePercent className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <p className="text-foreground">
              <span className="font-semibold">{percent}% Pay Now discount applied.</span>{" "}
              {saving ? `You save ${money(saving)}${total != null ? `, bringing your total to ${money(total)}` : ""}.` : "Choose your dates to see how much you save."}
            </p>
          </div>
        )
      ) : (
        <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5 text-sm">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">No discount with Pay at Desk.</span>{" "}
            {estimate?.payAtDeskTotal != null ? `You pay the full ${money(estimate.payAtDeskTotal)} when you collect the vehicle.` : "You pay the full amount when you collect the vehicle."}
          </p>
        </div>
      )}

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
                    "flex h-11 items-center gap-2 rounded-xl border bg-card px-5 text-sm font-medium transition",
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

          <div className="mt-7 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Billing Address</h3>

            <div className="mt-5 grid gap-5">
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
                  placeholder="Launceston"
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

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {trust.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </StepCard>
  );
}
