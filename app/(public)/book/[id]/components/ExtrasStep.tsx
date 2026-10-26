import { Check } from "lucide-react";
import { EmptyState, ErrorState, Spinner } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";
import type { StepProps } from "@/lib/booking";
import { extraLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";
import StepCard from "./StepCard";

export default function ExtrasStep({ data, update, onNext, onBack }: StepProps) {
  const { data: catalog, error, loading, reload } = useAsync(async () => (await bookingsApi.extras()).data, "extras");
  const extras = catalog?.extras;

  const toggle = (id: string) =>
    update({
      extras: data.extras.includes(id) ? data.extras.filter((e) => e !== id) : [...data.extras, id],
    });

  return (
    <StepCard
      title="Add extras"
      description="Enhance your rental with optional add-ons. The order summary updates with the final price."
      onSubmit={onNext}
      onBack={onBack}
    >
      {loading ? (
        <Spinner label="Loading extras…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !extras?.length ? (
        <EmptyState>No extras are available right now. You can continue without any.</EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {extras.map((extra) => {
            const selected = data.extras.includes(extra.id);
            return (
              <button
                key={extra.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(extra.id)}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card p-4 text-left transition hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                {selected && (
                  <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span className="text-[13px] font-semibold text-foreground">{extraLabel(extra)}</span>
                {extra.description && (
                  <span className="mt-1.5 min-h-8 text-[12px] leading-4 text-slate-500">{extra.description}</span>
                )}
                {extra.pricePerDay != null && (
                  <span className="mt-3 text-sm font-bold text-primary">
                    {money(extra.pricePerDay)}
                    <span className="text-[11px] font-medium text-muted-foreground"> / day</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      {catalog?.airportShuttle?.price != null && (
        <p className="mt-4 text-[11px] text-muted-foreground">
          {catalog.airportShuttle.name ?? "Airport shuttle"} ({money(catalog.airportShuttle.price)} flat) can be added on the next step.
        </p>
      )}
    </StepCard>
  );
}
