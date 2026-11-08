"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleAlert, CircleCheck, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS_PHONE, BUSINESS_PHONE_HREF } from "@/lib/business";
import {
  QUESTIONS,
  emptyAnswers,
  evaluateEligibility,
  grantEligibility,
  revokeEligibility,
  type EligibilityAnswers,
} from "@/lib/eligibility";
import { cn } from "@/lib/utils";

const FAULT_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
] as const;
const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

function Question({
  number,
  name,
  legend,
  options,
  value,
  onChange,
}: {
  number: number;
  name: keyof EligibilityAnswers;
  legend: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-[#e9e9e4] bg-[#f6f6f3] p-5 text-left">
      <legend className="sr-only">{legend}</legend>
      <p aria-hidden className="flex gap-3 text-[15px] font-semibold leading-snug text-neutral-900">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">{number}</span>
        {legend}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 sm:pl-9">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex h-11 min-w-24 cursor-pointer items-center justify-center rounded-xl border border-[#d9d9d2] bg-white px-5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#86d72f] has-[:checked]:border-[#86d72f] has-[:checked]:bg-[#86d72f]/20 has-[:checked]:text-neutral-900 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#86d72f]"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type Props = {
  /** Where "Continue" goes. Omit when the parent reacts through `onContinue` instead. */
  continueHref?: string;
  onContinue?: () => void;
  className?: string;
};

/** The three accident replacement eligibility questions with an instant, accessible result. */
export default function EligibilityChecker({ continueHref, onContinue, className }: Props) {
  const [answers, setAnswers] = useState<EligibilityAnswers>(emptyAnswers);
  const result = evaluateEligibility(answers);

  const set = (patch: Partial<EligibilityAnswers>) => {
    const next = { ...answers, ...patch };
    setAnswers(next);
    // Changing an answer always invalidates a previous confirmation.
    revokeEligibility();
  };

  const proceed = () => {
    grantEligibility(answers);
    onContinue?.();
  };

  const continueClass = cn(
    buttonVariants(),
    "h-11 gap-2 rounded-lg bg-[#9cdc33] pl-5 pr-2 text-sm font-semibold text-[#111512] hover:bg-[#8fce2b]"
  );
  const arrow = (
    <span className="flex size-7 items-center justify-center rounded-md bg-[#111512] text-[#9cdc33]">
      <ArrowUpRight size={14} />
    </span>
  );

  return (
    <div className={cn("grid gap-4", className)}>
      <Question
        number={1}
        name="atFault"
        legend={QUESTIONS.atFault}
        options={FAULT_OPTIONS}
        value={answers.atFault}
        onChange={(v) => set({ atFault: v as EligibilityAnswers["atFault"] })}
      />
      <Question
        number={2}
        name="hasDriverDetails"
        legend={QUESTIONS.hasDriverDetails}
        options={YES_NO_OPTIONS}
        value={answers.hasDriverDetails}
        onChange={(v) => set({ hasDriverDetails: v as EligibilityAnswers["hasDriverDetails"] })}
      />
      <Question
        number={3}
        name="driverInsured"
        legend={QUESTIONS.driverInsured}
        options={YES_NO_OPTIONS}
        value={answers.driverInsured}
        onChange={(v) => set({ driverInsured: v as EligibilityAnswers["driverInsured"] })}
      />

      <div role="status" aria-live="polite" className="text-left">
        {result.status === "incomplete" && <p className="px-1 text-sm text-neutral-500">Answer all three questions to see if you&apos;re eligible.</p>}

        {(result.status === "eligible" || result.status === "eligible-unsure") && (
          <div className="rounded-2xl border border-[#86d72f]/60 bg-[#86d72f]/15 p-5">
            <p className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <CircleCheck className="size-5 text-[#4f9a0e]" aria-hidden />
              {result.status === "eligible" ? "You're eligible to apply." : "You can continue with your application."}
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              {result.status === "eligible"
                ? "Based on your answers, you may be entitled to a replacement vehicle. Continue to the application and our team will take it from there."
                : "As you're unsure about fault, our team will review the circumstances when they assess your application."}
            </p>
            <div className="mt-4">
              {continueHref ? (
                <Link href={continueHref} onClick={proceed} className={continueClass}>
                  Continue to application
                  {arrow}
                </Link>
              ) : (
                <button type="button" onClick={proceed} className={continueClass}>
                  Continue to application
                  {arrow}
                </button>
              )}
            </div>
          </div>
        )}

        {result.status === "ineligible" && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-5">
            <p className="flex items-center gap-2 text-base font-bold text-red-900">
              <CircleAlert className="size-5" aria-hidden />
              Based on your answers, you aren&apos;t eligible for an accident replacement vehicle.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-900">
              {result.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-6 text-red-900/90">
              To be eligible you must not be at fault, have the at-fault driver&apos;s details, and the at-fault driver must have comprehensive or
              third-party car insurance. If your answers change, update them above.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/rent-a-car" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-lg bg-white text-sm font-semibold")}>
                Rent a car instead
              </Link>
              <a href={BUSINESS_PHONE_HREF} className={cn(buttonVariants({ variant: "outline" }), "h-10 gap-2 rounded-lg bg-white text-sm font-semibold")}>
                <Phone className="size-4" aria-hidden /> {BUSINESS_PHONE}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
