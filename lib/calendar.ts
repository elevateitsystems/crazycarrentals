// Calendar helpers on plain YYYY-MM-DD strings (what the date price API speaks). Everything is computed in UTC, so
// time zones and daylight saving can never shift a date.
import type { DailyRatesInput } from "@/lib/api/types";
import { nextDay } from "@/lib/pricing";

export const pad = (n: number) => String(n).padStart(2, "0");
export const toYmd = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
export const daysInMonth = (y: number, m0: number) => new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
/** Column of the 1st of the month in a Monday-first week (0 = Monday). */
export const firstWeekday = (y: number, m0: number) => (new Date(Date.UTC(y, m0, 1)).getUTCDay() + 6) % 7;
export const monthLabel = (y: number, m0: number) =>
  new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m0, 1)));
export const longDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
};

/** Today's date as the visitor's calendar shows it. */
export function todayYmd() {
  const t = new Date();
  return toYmd(t.getFullYear(), t.getMonth(), t.getDate());
}

/** Every date from `a` to `b` inclusive, in either order. */
export function dateRange(a: string, b: string): string[] {
  const [from, to] = a <= b ? [a, b] : [b, a];
  const out: string[] = [];
  for (let d = from; d <= to && out.length < 800; d = nextDay(d)) out.push(d);
  return out;
}

/**
 * Turns unsaved edits ({ date: price | null }) into the body of `PUT /cars/:id/daily-rates`.
 * Runs of 2+ consecutive dates with the same price go in `ranges`; single dates and `null` (back to the car's normal
 * rate, which the API only documents for `rates`) go in `rates`.
 */
export function buildDailyRatesInput(edits: Record<string, number | null>): DailyRatesInput {
  const ranges: NonNullable<DailyRatesInput["ranges"]> = [];
  const rates: NonNullable<DailyRatesInput["rates"]> = [];
  let run: { from: string; to: string; price: number; n: number } | null = null;
  const flush = () => {
    if (!run) return;
    if (run.n >= 2) ranges.push({ from: run.from, to: run.to, price: run.price });
    else rates.push({ date: run.from, price: run.price });
    run = null;
  };
  for (const date of Object.keys(edits).sort()) {
    const price = edits[date];
    if (price === null) {
      flush();
      rates.push({ date, price: null });
    } else if (run && run.price === price && nextDay(run.to) === date) {
      run.to = date;
      run.n += 1;
    } else {
      flush();
      run = { from: date, to: date, price, n: 1 };
    }
  }
  flush();
  return { ...(ranges.length ? { ranges } : {}), ...(rates.length ? { rates } : {}) };
}
