import { Check, Star, X } from "lucide-react";
import type { ExtraService } from "@/lib/api/types";
import { money } from "@/lib/format";
import { SECURITY_BOND, protectionKeyFor, protectionTiers, type ProtectionKey } from "@/lib/protection";
import { cn } from "@/lib/utils";

type Props = {
  extras: ExtraService[];
  selectedIds: string[];
  onChange: (extraIds: string[]) => void;
};

/**
 * "Choose your protection". Standard Cover is included. Medium and Platinum are priced by the backend: they are
 * offered when the backend has an extra with the package's name, and the selection is sent as that extra.
 */
export default function ProtectionPicker({ extras, selectedIds, onChange }: Props) {
  const byKey = new Map<ProtectionKey, ExtraService>();
  for (const e of extras) {
    const key = protectionKeyFor(e.name);
    if (key && !byKey.has(key)) byKey.set(key, e);
  }
  const protectionIds = [...byKey.values()].map((e) => e.id);
  const selectedKey: ProtectionKey = ([...byKey].find(([, e]) => selectedIds.includes(e.id))?.[0]) ?? "standard";

  const choose = (key: ProtectionKey) => {
    const rest = selectedIds.filter((id) => !protectionIds.includes(id));
    const extra = byKey.get(key);
    onChange(extra ? [...rest, extra.id] : rest);
  };

  return (
    <section aria-labelledby="protection-heading" className="@container">
      <h3 id="protection-heading" className="text-lg font-semibold text-foreground">
        Choose your protection
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">Select your protection / insurance excess reduction.</p>

      <div role="radiogroup" aria-labelledby="protection-heading" className="mt-6 grid gap-4 pt-3 @min-[40rem]:grid-cols-3">
        {protectionTiers.map((tier) => {
          const extra = byKey.get(tier.key);
          const available = tier.free || Boolean(extra);
          const selected = selectedKey === tier.key;
          const price = tier.free ? 0 : extra?.pricePerDay;

          return (
            <div
              key={tier.key}
              className={cn(
                "relative flex min-w-0 flex-col rounded-2xl border bg-card p-4 @min-[56rem]:p-5",
                selected ? "border-primary ring-2 ring-primary/30" : "border-border",
                !available && "opacity-70"
              )}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                  <Star className="size-3 fill-current" aria-hidden /> Most popular
                </span>
              )}
              <h4 className="text-base font-bold text-foreground">{tier.name}</h4>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {price != null ? money(price) : "—"}
                <span className="text-sm font-medium text-muted-foreground"> / day</span>
              </p>

              <ul className="mt-4 space-y-1.5 text-[13px]">
                {tier.included.map((x) => (
                  <li key={x} className="flex gap-2 text-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                    <span><span className="sr-only">Included: </span>{x}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-[13px]">
                {tier.excluded.map((x) => (
                  <li key={x} className="flex gap-2 text-muted-foreground">
                    <X className="mt-0.5 size-3.5 shrink-0 text-red-500" strokeWidth={3} aria-hidden />
                    <span><span className="sr-only">Not covered: </span>{x}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-border pt-3 text-[13px] text-muted-foreground">
                <p className="font-semibold text-foreground">{tier.excess.label}:</p>
                <p>Ages 25+: {tier.excess.over25}</p>
                <p>Under 25: {tier.excess.under25}</p>
              </div>
              <div className="mt-3 border-t border-border pt-3 text-[13px] text-muted-foreground">
                <p className="font-semibold text-foreground">Security bond hold:</p>
                <p>Credit card: {SECURITY_BOND.credit}</p>
                <p>Debit card: {SECURITY_BOND.debit}</p>
              </div>

              <div className="min-h-5 flex-1" aria-hidden />
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!available}
                onClick={() => choose(tier.key)}
                className={cn(
                  "min-h-11 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60 hover:bg-muted"
                )}
              >
                {!available ? "Not available online yet" : selected ? `${tier.name} selected` : `Select ${tier.key === "standard" ? "Standard" : tier.key === "medium" ? "Medium" : "Platinum"}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
