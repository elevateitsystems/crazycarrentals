"use client";

import { useMemo, useState } from "react";
import CarCard from "@/components/CarCard";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/Feedback";
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

  if (loading) return <CardGridSkeleton label="Loading vehicles…" className="mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const countFor = (type: string) => (type === "All" ? (data ?? []).length : (data ?? []).filter((c) => c.carType === type).length);

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by vehicle type" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {["All", ...types].map((type) => {
            const selected = active === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(type)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected
                    ? "border-secondary bg-secondary text-white shadow-[0_10px_22px_-12px_rgba(17,21,18,0.7)]"
                    : "border-border bg-white text-foreground hover:border-foreground/30 hover:bg-muted"
                )}
              >
                {type === "All" ? "All vehicles" : enumLabel(type)}
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums", selected ? "bg-primary text-secondary" : "bg-muted text-muted-foreground")}>
                  {countFor(type)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-bold text-foreground">{visible.length}</span> {visible.length === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState>No vehicles in this category yet.</EmptyState>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {visible.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
