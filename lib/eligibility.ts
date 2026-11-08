import { useSyncExternalStore } from "react";

// Accident replacement eligibility, using the client's three questions and rules:
//   - at fault (Yes)                         -> not eligible
//   - at-fault driver's details unavailable  -> not eligible
//   - at-fault driver has no insurance       -> not eligible
//   - not at fault (No), or unsure about fault, with both of the other answers Yes -> may apply

export type FaultAnswer = "yes" | "no" | "unsure";
export type YesNo = "yes" | "no";

export type EligibilityAnswers = {
  atFault: FaultAnswer | "";
  hasDriverDetails: YesNo | "";
  driverInsured: YesNo | "";
};

export const emptyAnswers: EligibilityAnswers = { atFault: "", hasDriverDetails: "", driverInsured: "" };

export const QUESTIONS = {
  atFault: "Was the accident your fault?",
  hasDriverDetails: "Do you have the At-Fault Driver's details?",
  driverInsured: "Does the At-Fault Driver have a comprehensive or third-party car insurance?",
} as const;

export type EligibilityResult =
  | { status: "incomplete" }
  | { status: "eligible" | "eligible-unsure" }
  | { status: "ineligible"; reasons: string[] };

export function evaluateEligibility(a: EligibilityAnswers): EligibilityResult {
  const reasons: string[] = [];
  if (a.atFault === "yes") reasons.push("The accident was your fault.");
  if (a.hasDriverDetails === "no") reasons.push("You don't have the at-fault driver's details.");
  if (a.driverInsured === "no") reasons.push("The at-fault driver doesn't have comprehensive or third-party car insurance.");
  if (reasons.length) return { status: "ineligible", reasons };

  if (!a.atFault || !a.hasDriverDetails || !a.driverInsured) return { status: "incomplete" };
  return { status: a.atFault === "unsure" ? "eligible-unsure" : "eligible" };
}

export const canApply = (a: EligibilityAnswers) => {
  const { status } = evaluateEligibility(a);
  return status === "eligible" || status === "eligible-unsure";
};

// The confirmed answers are kept for the browser session so the application page can tell that the
// questions were answered first. It is a convenience gate, not a security boundary: applications are sent by email.
const KEY = "tasdrive.eligibility";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function read(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function grantEligibility(answers: EligibilityAnswers) {
  if (!canApply(answers)) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // Storage blocked: the gate falls back to asking the questions again.
  }
  emit();
}

export function revokeEligibility() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  emit();
}

function parse(raw: string): EligibilityAnswers | null {
  if (!raw) return null;
  try {
    const a = JSON.parse(raw) as EligibilityAnswers;
    return canApply(a) ? a : null;
  } catch {
    return null;
  }
}

/** The answers that passed the eligibility check in this session, or null. Always null on the server. */
export function useGrantedEligibility(): EligibilityAnswers | null {
  const raw = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => ""
  );
  return parse(raw);
}
