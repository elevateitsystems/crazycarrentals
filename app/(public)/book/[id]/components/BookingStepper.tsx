import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { steps } from "@/lib/booking";

export default function BookingStepper({ current }: { current: number }) {
  return (
    <header className="border-b border-border bg-card px-4 pb-4 pt-6 sm:px-6">
      <ol className="mx-auto flex max-w-4xl">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;

          return (
            <li key={label} aria-current={active ? "step" : undefined} className="relative flex min-w-0 flex-1 flex-col items-center">
              {n < steps.length && (
                <span
                  className={cn(
                    "absolute left-1/2 top-[18px] h-0.5 w-full -translate-y-1/2",
                    done ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-9 items-center justify-center rounded-full text-sm font-semibold",
                  done && "bg-primary text-white",
                  active && "bg-foreground text-background",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check size={16} strokeWidth={3} /> : n}
              </span>
              <span
                className={cn(
                  "mt-2 hidden px-1 text-center text-xs font-medium sm:block sm:text-sm",
                  done && "text-primary",
                  active && "font-semibold text-foreground",
                  !done && !active && "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      {/* Narrow screens have no room for five labels, so only the current step is named. */}
      <p className="mt-3 text-center text-sm font-semibold text-foreground sm:hidden">
        Step {Math.min(current, steps.length)} of {steps.length}: {steps[Math.min(current, steps.length) - 1]}
      </p>
    </header>
  );
}