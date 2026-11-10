import { money } from "@/lib/format";
import { groupDailyRates, groupPriceLines, hasVariableRates, shortDate } from "@/lib/pricing";
import type { DailyRate, PriceLine } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Props = {
  lines: PriceLine[] | undefined;
  /** Per-night rates, when known (booking estimate). Shown as a "rate for each date" list if they differ. */
  dailyRates?: DailyRate[];
  className?: string;
};

/**
 * The price lines of a booking in three parts: vehicle rate, protection & extras, and the Pay Now discount.
 * The discount is labelled as applying to the vehicle rate only, which is how the backend charges it.
 */
export default function PriceBreakdown({ lines, dailyRates, className }: Props) {
  const g = groupPriceLines(lines);
  const runs = groupDailyRates(dailyRates);
  const variable = hasVariableRates(dailyRates);

  return (
    <dl className={cn("space-y-3 text-[15px]", className)}>
      {g.vehicle.map((l, i) => (
        <Row key={`v-${l.label}-${i}`} label={l.label} amount={l.amount} />
      ))}

      {variable && (
        <details className="-mt-1 text-[13px] text-muted-foreground">
          <summary className="cursor-pointer select-none font-medium underline-offset-2 hover:underline">Rate for each date</summary>
          <ul className="mt-2 space-y-1 rounded-lg bg-muted/50 p-3">
            {runs.map((r) => (
              <li key={r.from} className="flex justify-between gap-3">
                <span>{r.from === r.to ? shortDate(r.from) : `${shortDate(r.from)} – ${shortDate(r.to)}`}</span>
                <span className="font-medium text-foreground">
                  {r.nights} {r.nights === 1 ? "night" : "nights"} × {money(r.price)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {g.addOns.length > 0 && (
        <>
          <div className="border-t border-border pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Protection &amp; extras</div>
          {g.addOns.map((l, i) => (
            <Row key={`a-${l.label}-${i}`} label={l.label} amount={l.amount} />
          ))}
        </>
      )}

      {g.discount && (
        <div className="border-t border-border pt-3">
          <Row label={g.discount.label} amount={g.discount.amount} />
          <p className="mt-0.5 text-xs text-muted-foreground">Taken off the vehicle rate only. Protection and extras are not discounted.</p>
        </div>
      )}
    </dl>
  );
}

function Row({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between gap-3 text-muted-foreground">
      <dt>{label}</dt>
      <dd className={cn("shrink-0 font-medium", amount < 0 ? "text-green-700" : "text-foreground")}>{money(amount)}</dd>
    </div>
  );
}
