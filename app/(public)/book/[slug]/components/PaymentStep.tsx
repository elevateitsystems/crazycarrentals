import { ShieldCheck } from "lucide-react";
import type { StepProps } from "@/lib/booking";
import { cn } from "@/lib/utils";
import FormField from "./FormField";
import StepCard from "./StepCard";

const methods = [
  { id: "credit", label: "Credit Card" },
  { id: "debit", label: "Debit Card" },
] as const;

const trust = ["256-bit SSL encryption", "PCI-DSS compliant", "Secure payment gateway"];

export default function PaymentStep({ total, data, update, onNext, onBack }: StepProps & { total: number }) {
  return (
    <StepCard
      title="Payment details"
      description="Your card will be charged the total amount shown. A security bond is held separately at pickup."
      nextLabel={`Confirm & Pay $${total}`}
      onSubmit={onNext}
      onBack={onBack}
    >
      <div className="flex gap-2">
        {methods.map(({ id, label }) => {
          const active = data.paymentMethod === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => update({ paymentMethod: id })}
              className={cn(
                "flex h-9 items-center gap-2 rounded-lg border bg-card px-4 text-[11px] font-medium transition",
                active ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {active && <span className="size-1.5 rounded-full bg-foreground" />}
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4">
        <FormField
          id="cardNumber"
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          required
          value={data.cardNumber}
          onChange={(e) => update({ cardNumber: e.target.value })}
        />
        <FormField
          id="cardName"
          label="Name on card"
          autoComplete="cc-name"
          placeholder="Sarah Mitchell"
          required
          value={data.cardName}
          onChange={(e) => update({ cardName: e.target.value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            id="cardExpiry"
            label="Expiry date"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            required
            value={data.cardExpiry}
            onChange={(e) => update({ cardExpiry: e.target.value })}
          />
          <FormField
            id="cardCvc"
            label="CVV"
            autoComplete="cc-csc"
            placeholder="• • •"
            required
            value={data.cardCvc}
            onChange={(e) => update({ cardCvc: e.target.value })}
          />
        </div>
      </div>

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