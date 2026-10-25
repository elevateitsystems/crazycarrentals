import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { steps } from "@/lib/booking";

export default function BookingStepper({ current }: { current: number }) {
  return (
    <header className="border-b border-border bg-card px-6 pb-3.5 pt-5">
      <ol className="mx-auto flex max-w-3xl">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;

          return (
            <li key={label} className="relative flex flex-1 flex-col items-center">
              {n < steps.length && (
                <span
                  className={cn(
                    "absolute left-1/2 top-3.5 h-px w-full -translate-y-1/2",
                    done ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-7 items-center justify-center rounded-full text-[10px] font-semibold",
                  done && "bg-primary text-white",
                  active && "bg-foreground text-background",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : n}
              </span>
              <span
                className={cn(
                  "mt-1.5 text-[9px] font-medium",
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
    </header>
  );
}