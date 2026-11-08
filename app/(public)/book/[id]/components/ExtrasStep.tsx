import { Check } from "lucide-react";
import { EmptyState, ErrorState, Spinner } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";
import type { StepProps } from "@/lib/booking";
import { extraLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { protectionKeyFor } from "@/lib/protection";
import ProtectionPicker from "./ProtectionPicker";
import StepCard from "./StepCard";

export default function ExtrasStep({ data, update, onNext, onBack }: StepProps) {
  const { data: catalog, error, loading, reload } = useAsync(async () => (await bookingsApi.extras()).data, "extras");
  const allExtras = catalog?.extras ?? [];
  // Protection packages are chosen above, so they are not repeated in the extras list.
  const extras = allExtras.filter((e) => !protectionKeyFor(e.name));

  const toggle = (id: string) =>
    update({
      extras: data.extras.includes(id) ? data.extras.filter((e) => e !== id) : [...data.extras, id],
    });

  return (
    <StepCard
      title="Protection & extras"
      description="Choose your protection, then add any optional extras. The order summary updates with the final price."
      onSubmit={onNext}
      onBack={onBack}
    >
      {loading ? (
        <Spinner label="Loading protection and extras…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <>
          <ProtectionPicker extras={allExtras} selectedIds={data.extras} onChange={(ids) => update({ extras: ids })} />

          <h3 className="mb-1 mt-10 text-lg font-semibold text-foreground">Optional extras and additional services</h3>
          <p className="mb-5 text-sm text-muted-foreground">Tick any extra you would like to add.</p>
          {!extras.length ? (
            <EmptyState>No extras are available right now. You can continue without any.</EmptyState>
          ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {extras.map((extra) => {
            const selected = data.extras.includes(extra.id);
            return (
              <button
                key={extra.id}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggle(extra.id)}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-5 text-left transition hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-4 top-4 flex size-6 items-center justify-center rounded-md border-2",
                    selected ? "border-primary bg-primary text-white" : "border-border bg-background"
                  )}
                >
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
                <span className="pr-9 text-base font-semibold text-foreground">{extraLabel(extra)}</span>
                {extra.description && (
                  <span className="mt-1.5 min-h-8 text-sm leading-5 text-muted-foreground">{extra.description}</span>
                )}
                {extra.pricePerDay != null && (
                  <span className="mt-4 text-lg font-bold text-foreground">
                    {money(extra.pricePerDay)}
                    <span className="text-sm font-medium text-muted-foreground"> / day</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
          )}
        </>
      )}
    </StepCard>
  );
}
