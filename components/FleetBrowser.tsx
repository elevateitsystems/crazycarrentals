"use client";

import { useMemo, useState } from "react";
import CarCard from "@/components/CarCard";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { carsApi } from "@/lib/api/services";
import type { Car as ApiCar } from "@/lib/api/types";
import { toCar } from "@/lib/cars";
import { enumLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Fleet grid with car-type chips. Chips come from the cars the backend returns, not a hardcoded list. */
export default function FleetBrowser({ limit = 100, className }: { limit?: number; className?: string }) {
  const [active, setActive] = useState("All");
  const { data, error, loading, reload } = useAsync(async () => toList<ApiCar>((await carsApi.list({ limit })).data), String(limit));

  const types = useMemo(() => [...new Set((data ?? []).map((c) => c.carType).filter(Boolean) as string[])], [data]);
  const visible = useMemo(
    () => (data ?? []).filter((c) => active === "All" || c.carType === active).map(toCar),
    [data, active],
  );

  if (loading) return <CardGridSkeleton label="Loading vehicles…" className="mt-8 lg:grid-cols-3" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {["All", ...types].map((type) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            aria-pressed={active === type}
            onClick={() => setActive(type)}
            className={cn(
              "h-9.5 rounded-[10px] px-4 text-xs font-medium text-foreground shadow-none",
              active === type
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                : "border-border bg-card hover:bg-muted"
            )}
          >
            {type === "All" ? "All" : enumLabel(type)}
          </Button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState>No vehicles in this category yet.</EmptyState>
      ) : (
        <div className="mt-8 grid gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
