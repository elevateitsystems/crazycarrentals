import { Check, Star, X } from "lucide-react";
import type { Protection } from "@/lib/api/types";
import { money } from "@/lib/format";
import { STANDARD_ID, buildTiers, type ProtectionTier } from "@/lib/protection";
import { cn } from "@/lib/utils";

type Props = {
  protections: Protection[];
  /** "standard" or a protection id. */
  selected: string;
  selectedIds: string[];
  /** The chosen package and the extra ids to send (the package's own id, unless it is Standard, plus any other extras). */
  onChange: (tier: ProtectionTier, extraIds: string[]) => void;
};

/**
 * "Choose your protection". Standard Cover is included in the rental; every other package comes from the backend
 * (Admin → Protection management). A paid package is booked by sending its id as an extra, so the backend prices it.
 */
export default function ProtectionPicker({ protections, selected, selectedIds, onChange }: Props) {
  const tiers = buildTiers(protections);
  const protectionIds = protections.map((p) => p.id);
  // A package that was removed since it was chosen falls back to Standard.
  const selectedId = tiers.some((t) => t.id === selected) ? selected : STANDARD_ID;

  const choose = (tier: ProtectionTier) => {
    const rest = selectedIds.filter((id) => !protectionIds.includes(id));
    onChange(tier, tier.free ? rest : [...rest, tier.id]);
  };

  return (
    <section aria-labelledby="protection-heading" className="@container">
      <h3 id="protection-heading" className="text-lg font-semibold text-foreground">
        Choose your protection
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">Select your protection / insurance excess reduction.</p>

      <div role="radiogroup" aria-labelledby="protection-heading" className="mt-6 grid gap-4 pt-3 @min-[40rem]:grid-cols-3">
        {tiers.map((tier) => {
          const selected = selectedId === tier.id;

          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex min-w-0 flex-col rounded-2xl border bg-card p-4 @min-[56rem]:p-5",
                selected ? "border-primary ring-2 ring-primary/30" : "border-border"
              )}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                  <Star className="size-3 fill-current" aria-hidden /> Most popular
                </span>
              )}
              <h4 className="text-base font-bold text-foreground">{tier.name}</h4>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {money(tier.pricePerDay)}
                <span className="text-sm font-medium text-muted-foreground"> / day</span>
              </p>
              {tier.free && <p className="mt-0.5 text-xs text-muted-foreground">Included in your rental</p>}

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
                <p className="font-semibold text-foreground">{tier.excessLabel}:</p>
                <p>Ages 25+: {tier.excessOver25}</p>
                <p>Under 25: {tier.excessUnder25}</p>
              </div>
              <div className="mt-3 border-t border-border pt-3 text-[13px] text-muted-foreground">
                <p className="font-semibold text-foreground">Security bond hold:</p>
                <p>Credit card: {tier.bondCredit}</p>
                <p>Debit card: {tier.bondDebit}</p>
              </div>

              <div className="min-h-5 flex-1" aria-hidden />
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(tier)}
                className={cn(
                  "min-h-11 w-full rounded-xl border px-3 py-2 text-center text-sm font-semibold leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60 hover:bg-muted"
                )}
              >
                {selected ? `${tier.name} selected` : `Select ${tier.name.replace(/ (Cover|Protection|Premium)$/, "")}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
