// Protection packages as set out by the client (PDF "insurance package and extras").
// Prices are NOT defined here: they are charged by the backend. A paid package is bookable only when the backend has an
// extra with a matching name (Admin → Extras), so the price shown is always the price that is charged.

export type ProtectionKey = "standard" | "medium" | "platinum";

export type ProtectionTier = {
  key: ProtectionKey;
  name: string;
  popular?: boolean;
  /** Included in the rental price. */
  free?: boolean;
  /** Normalised backend extra names that identify this package (see `normaliseName`). */
  match: string[];
  included: string[];
  excluded: string[];
  /** Damage excess by driver age. */
  excess: { label: string; over25: string; under25: string };
};

export const normaliseName = (s: string | undefined) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const SECURITY_BOND = { credit: "$200.00", debit: "$500.00" };

export const protectionTiers: ProtectionTier[] = [
  {
    key: "standard",
    name: "Standard Cover",
    free: true,
    match: [],
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
    excess: { label: "Excess applicable", over25: "$6,000", under25: "$6,500" },
  },
  {
    key: "medium",
    name: "Medium Protection",
    match: ["mediumprotection", "medium"],
    included: [
      "Third Party",
      "Personal Injury",
      "Damage to the Vehicle, Fire & Theft",
      "Animal Damage",
      "24hr Roadside",
      "Hail & Storm Damage",
      "Vehicle Interior Damage",
    ],
    // The client's table also lists Hail & Storm and Vehicle Interior under "not covered" for Medium while ticking them as
    // covered, and the Terms and Conditions (10.2) say Medium covers them. They are shown as covered only; see the handover notes.
    excluded: ["Windscreen/Tyres", "Accident Towing", "Key replacement", "Overhead & Underbody Damage", "Accident Fees", "Loss of Use"],
    excess: { label: "Accident excess applicable", over25: "$3,000", under25: "$3,500" },
  },
  {
    key: "platinum",
    name: "Platinum Premium",
    popular: true,
    match: ["platinumpremium", "platinumpremiumprotection", "platinumprotection", "platinum"],
    included: [
      "Third Party",
      "Personal Injury",
      "Damage to the Vehicle, Fire & Theft",
      "Animal Damage",
      "24hr Roadside",
      "Hail & Storm Damage",
      "Vehicle Interior Damage",
      "Tyres & Windscreen",
      "Accident Fees",
      "Loss of Use",
      "Accident Towing",
    ],
    excluded: ["Overhead & Underbody Damage", "Key replacement"],
    excess: { label: "Accident excess applicable", over25: "$0 (zero excess)", under25: "N/A" },
  },
];

/** Which package a backend extra represents, if any. */
export function protectionKeyFor(extraName: string | undefined): ProtectionKey | null {
  const n = normaliseName(extraName);
  if (!n) return null;
  return protectionTiers.find((t) => t.match.includes(n))?.key ?? null;
}
