import { cn } from "@/lib/utils";

type Props<T extends string> = {
  tabs: readonly T[];
  active: T;
  onSelect: (tab: T) => void;
};

export default function FaqTabs<T extends string>({ tabs, active, onSelect }: Props<T>) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab)}
            className={cn(
              "h-9 rounded-full border px-4.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}