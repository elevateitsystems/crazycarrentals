import { MapPin } from "lucide-react";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

type Props = {
  location: Location;
  active: boolean;
  onSelect: () => void;
};

export default function LocationCard({ location, active, onSelect }: Props) {
  const { name, address, summaryHours } = location;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active ? "border-primary/30 bg-primary/10" : "border-border bg-card hover:bg-muted/60"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <MapPin size={13} />
      </span>

      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground">{name}</span>
        <span className="mt-1 block text-[11px] text-muted-foreground">{address}</span>
        <span className="mt-1.5 block text-[11px] text-muted-foreground/70">{summaryHours}</span>
      </span>
    </button>
  );
}