import { Check, ChevronDown } from "lucide-react";
import type { StepProps } from "@/lib/booking";
import { cn } from "@/lib/utils";
import FormField, { inputStyles } from "./FormField";
import StepCard from "./StepCard";

const states = ["TAS", "NSW", "VIC", "QLD", "SA", "WA", "NT", "ACT"];

const requirements = [
  "Minimum age 21 years (surcharge applies under 25)",
  "Full Australian licence or valid International Driving Permit",
  "Licence must be current — no provisional or learner licences",
  "All listed drivers must present their licence at pickup",
];

export default function DriverStep({ data, update, onNext, onBack }: StepProps) {
  return (
    <StepCard
      title="Driver information"
      description="All drivers must hold a current, valid licence. Details are verified at pickup."
      nextLabel="Continue to Payment"
      onSubmit={onNext}
      onBack={onBack}
    >
      <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2">
        <FormField
          id="dob"
          label="Date of birth"
          type="date"
          required
          value={data.dob}
          onChange={(e) => update({ dob: e.target.value })}
        />
        <FormField id="licenceState" label="Licence state">
          <div className="relative">
            <select
              id="licenceState"
              name="licenceState"
              required
              value={data.licenceState}
              onChange={(e) => update({ licenceState: e.target.value })}
              className={cn(
                inputStyles,
                "w-full appearance-none border outline-none",
                data.licenceState ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <option value="">Select state...</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground" />
          </div>
        </FormField>
        <FormField
          id="licenceNumber"
          label="Licence number"
          placeholder="e.g. 12345678"
          required
          value={data.licenceNumber}
          onChange={(e) => update({ licenceNumber: e.target.value })}
        />
        <FormField
          id="licenceExpiry"
          label="Licence expiry"
          type="date"
          required
          value={data.licenceExpiry}
          onChange={(e) => update({ licenceExpiry: e.target.value })}
        />
      </div>

      <div className="mt-5 rounded-xl border border-border bg-muted/60 p-4">
        <h3 className="text-xs font-semibold text-foreground">Licence requirements</h3>
        <ul className="mt-3 space-y-2">
          {requirements.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Check className="size-3.5 shrink-0 text-primary" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </StepCard>
  );
}