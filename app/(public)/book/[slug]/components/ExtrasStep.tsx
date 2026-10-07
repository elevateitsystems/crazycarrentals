import { Check } from "lucide-react";
import { extrasList, type StepProps } from "@/lib/booking";
import { cn } from "@/lib/utils";
import StepCard from "./StepCard";

export default function ExtrasStep({ days, data, update, onNext, onBack }: StepProps & { days: number }) {
  const toggle = (id: string) =>
    update({
      extras: data.extras.includes(id) ? data.extras.filter((e) => e !== id) : [...data.extras, id],
    });

  return (
    <StepCard
      title="Add extras"
      description="Enhance your rental with optional add-ons. All prices are per day."
      onSubmit={onNext}
      onBack={onBack}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {extrasList.map(({ id, title, description, pricePerDay }) => {
          const selected = data.extras.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(id)}
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
              <span className="text-[13px] font-semibold text-foreground">{title}</span>
              <span className="mt-1.5 min-h-8 text-[12px] leading-4 text-slate-500">{description}</span>
              <span className="mt-3 flex items-baseline gap-1">
                <span className="text-sm font-bold text-primary">${pricePerDay}</span>
                <span className="text-[11px] text-slate-500">
                  /day → ${pricePerDay * days} total
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}