"use client";

import { CircleCheck } from "lucide-react";
import EligibilityChecker from "@/components/EligibilityChecker";
import { revokeEligibility, useGrantedEligibility } from "@/lib/eligibility";
import ApplyForm from "./ApplyForm";

/** The application is only shown once the three eligibility questions have been answered in an eligible way. */
export default function ApplyGate() {
  const eligibility = useGrantedEligibility();

  if (!eligibility) {
    return (
      <div>
        <h2 className="text-lg font-bold tracking-tight">Before you apply</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">Please answer these questions first to confirm you&apos;re eligible.</p>
        <EligibilityChecker className="mt-6" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
        <CircleCheck className="size-4 shrink-0 text-primary" aria-hidden />
        <span className="font-medium">Eligibility confirmed.</span>
        <button type="button" onClick={revokeEligibility} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Change my answers
        </button>
      </p>
      <ApplyForm eligibility={eligibility} />
    </div>
  );
}
