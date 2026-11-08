import { money } from "@/lib/format";
import type { Protection } from "@/lib/api/types";

// Protection packages are managed in Admin → Protection management and served by the backend with the booking extras.
// Standard Cover is included in every rental, so it is not a backend record: it is defined here from the client's PDF
// ("insurance package and extras") and is always offered first.

export const STANDARD_ID = "standard";

/** What the booking page shows for one package, whether it is Standard Cover or a backend protection. */
export type ProtectionTier = {
  /** "standard", or the backend protection id (which is also the extra id to book). */
  id: string;
  name: string;
  popular: boolean;
  /** Included in the rental price. */
  free: boolean;
  pricePerDay: number;
  included: string[];
  excluded: string[];
  excessLabel: string;
  excessOver25: string;
  excessUnder25: string;
  bondCredit: string;
  bondDebit: string;
};

export const DEFAULT_BOND = { credit: 200, debit: 500 };

export const STANDARD_TIER: ProtectionTier = {
  id: STANDARD_ID,
  name: "Standard Cover",
  popular: false,
  free: true,
  pricePerDay: 0,
  included: ["Third Party", "Personal Injury", "Damage to the Vehicle, Fire & Theft"],
  excluded: [
    "Animal Damage",
    "Hail & Storm Damage",
    "Vehicle Interior Damage",
    "Overhead & Underbody Damage",
    "Key replacement",
    "Tyres & Windscreen",
    "Accident Fees",
    "Loss of Use",
    "Accident-Related Towage",
  ],
  excessLabel: "Excess applicable",
  excessOver25: "$6,000",
  excessUnder25: "$6,500",
  bondCredit: money(DEFAULT_BOND.credit),
  bondDebit: money(DEFAULT_BOND.debit),
};

export function toTier(p: Protection): ProtectionTier {
  return {
    id: p.id,
    name: p.name,
    popular: Boolean(p.isPopular),
    free: false,
    pricePerDay: p.pricePerDay,
    included: p.included ?? [],
    excluded: p.excluded ?? [],
    excessLabel: p.excessLabel || "Accident excess applicable",
    excessOver25: p.excessOver25 || "—",
    excessUnder25: p.excessUnder25 || "—",
    bondCredit: money(p.bondCredit ?? DEFAULT_BOND.credit),
    bondDebit: money(p.bondDebit ?? DEFAULT_BOND.debit),
  };
}

/** Standard Cover first, then the backend's packages from cheapest to dearest. */
export function buildTiers(protections: Protection[] | undefined): ProtectionTier[] {
  const paid = [...(protections ?? [])].sort((a, b) => a.pricePerDay - b.pricePerDay).map(toTier);
  return [STANDARD_TIER, ...paid];
}
