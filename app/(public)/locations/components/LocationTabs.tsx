import { MapPin } from "lucide-react";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

type Props = {
  locations: Location[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export default function LocationTabs({ locations, activeSlug, onSelect }: Props) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {locations.map(({ slug, name }) => {
        const active = slug === activeSlug;
        return (
          <button
            key={slug}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(slug)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[14px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-slate-600 hover:bg-muted"
            )}
          >
            <MapPin size={13} className={active ? "text-primary" : "text-muted-foreground"} />
            {name}
          </button>
        );
      })}
    </div>
  );
}