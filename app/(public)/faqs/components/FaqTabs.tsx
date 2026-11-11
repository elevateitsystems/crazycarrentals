import { cn } from "@/lib/utils";

type Props<T extends string> = {
  tabs: readonly T[];
  active: T;
  onSelect: (tab: T) => void;
};

export default function FaqTabs<T extends string>({ tabs, active, onSelect }: Props<T>) {
  return (
    <div role="tablist" className="grid w-full gap-1.5 rounded-2xl bg-muted p-1.5 sm:inline-grid sm:w-auto sm:grid-flow-col">
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
              "h-11 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
