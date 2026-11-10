import type { DailyRate, PriceLine } from "@/lib/api/types";

// Shared price presentation for every booking screen (order summary, confirmation, My Bookings).
// The backend owns the prices: it charges the car's rate for each date (calendar date prices), adds protection and
// extras, and takes the Pay Now discount off the VEHICLE charge only. These helpers only group what the backend sent,
// so every screen shows the same sections and the same totals.

export type PriceGroups = {
  /** Vehicle rate lines, e.g. "1 day × $105", "3 days × $150". */
  vehicle: PriceLine[];
  /** Protection cover, extras and transfers. These are never discounted. */
  addOns: PriceLine[];
  /** The Pay Now discount line (a negative amount), if one applies. */
  discount: PriceLine | null;
  vehicleSubtotal: number;
  addOnsSubtotal: number;
};

const VEHICLE_LINE = /^\s*\d+\s*(?:days?|nights?)\s*[×x]/i;

export function groupPriceLines(lines: PriceLine[] | undefined): PriceGroups {
  const groups: PriceGroups = { vehicle: [], addOns: [], discount: null, vehicleSubtotal: 0, addOnsSubtotal: 0 };
  for (const line of lines ?? []) {
    if (typeof line?.amount !== "number") continue;
    if (line.amount < 0 || /discount/i.test(line.label)) {
      groups.discount = groups.discount ? { label: groups.discount.label, amount: groups.discount.amount + line.amount } : line;
    } else if (VEHICLE_LINE.test(line.label)) {
      groups.vehicle.push(line);
      groups.vehicleSubtotal += line.amount;
    } else {
      groups.addOns.push(line);
      groups.addOnsSubtotal += line.amount;
    }
  }
  return groups;
}

export type RateRun = { from: string; to: string; nights: number; price: number };

/** Consecutive nights charged at the same rate, in date order. */
export function groupDailyRates(rates: DailyRate[] | undefined): RateRun[] {
  const runs: RateRun[] = [];
  for (const r of [...(rates ?? [])].sort((a, b) => a.date.localeCompare(b.date))) {
    const last = runs[runs.length - 1];
    if (last && last.price === r.price && nextDay(last.to) === r.date) {
      last.to = r.date;
      last.nights += 1;
    } else {
      runs.push({ from: r.date, to: r.date, nights: 1, price: r.price });
    }
  }
  return runs;
}

/** True when the stay is not charged at one flat rate (some night has a different price). */
export const hasVariableRates = (rates: DailyRate[] | undefined) => new Set((rates ?? []).map((r) => r.price)).size > 1;

/** YYYY-MM-DD → the next calendar day, computed in UTC so time zones and daylight saving never shift it. */
export function nextDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

/** "24 Dec" for a YYYY-MM-DD date. */
export function shortDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}
