"use client";

import Link from "next/link";
import { ArrowUpRight, CircleCheck, ClipboardCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { revokeEligibility, useGrantedEligibility } from "@/lib/eligibility";
import { cn } from "@/lib/utils";
import ApplyForm from "./ApplyForm";

/**
 * The application is only shown once the eligibility questions (on the Accident Replacement page) have been answered
 * in an eligible way. Anyone arriving here without that is sent back to the questions.
 */
export default function ApplyGate() {
  const eligibility = useGrantedEligibility();

  if (!eligibility) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <ClipboardCheck className="mx-auto size-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-lg font-bold tracking-tight">Check your eligibility first</h2>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] text-muted-foreground">
          Please answer the three eligibility questions before you apply. It only takes a moment.
        </p>
        <Link
          href="/accident-replacement#eligibility"
          className={cn(buttonVariants(), "mt-5 h-11 gap-2 rounded-lg bg-[#9cdc33] pl-5 pr-2 text-sm font-semibold text-[#111512] hover:bg-[#8fce2b]")}
        >
          Check My Eligibility
          <span className="flex size-7 items-center justify-center rounded-md bg-[#111512] text-[#9cdc33]">
            <ArrowUpRight size={14} />
          </span>
        </Link>
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
