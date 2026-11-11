"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CarImage from "@/components/CarImage";
import { EmptyState, ErrorState } from "@/components/Feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { carsApi } from "@/lib/api/services";
import type { Car } from "@/lib/api/types";
import { carImage, carName, enumLabel } from "@/lib/format";

type Category = { type: string; representative: Car; count: number };

/**
 * One card per vehicle category, built from the cars the backend returns: the category's first vehicle
 * (preferring one that has a photo) stands in for it. Nothing is hardcoded, so new categories appear as soon
 * as a car of that type exists, and the photo changes when that car's images are replaced in the admin.
 */
export default function VehicleTypes({ className }: { className?: string }) {
  const { data, error, loading, reload } = useAsync(async () => toList<Car>((await carsApi.list({ limit: 100 })).data), "vehicle-types");

  const categories = useMemo<Category[]>(() => {
    const byType = new Map<string, Car[]>();
    for (const car of data ?? []) {
      if (!car.carType) continue;
      byType.set(car.carType, [...(byType.get(car.carType) ?? []), car]);
    }
    return [...byType].map(([type, cars]) => ({ type, representative: cars.find((c) => carImage(c)) ?? cars[0], count: cars.length }));
  }, [data]);

  if (loading) {
    return (
      <div role="status" aria-busy="true" aria-label="Loading vehicle types…" className={className}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
        <span className="sr-only">Loading vehicle types…</span>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!categories.length) return <EmptyState>Our vehicle range will appear here soon.</EmptyState>;

  return (
    <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] ${className ?? ""}`}>
      {categories.map(({ type, representative, count }) => (
        <li key={type}>
          <Link
            href={`/rent-a-car?carType=${encodeURIComponent(type)}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(17,21,18,0.04)] transition duration-300 hover:border-primary/50 hover:shadow-[0_22px_44px_-22px_rgba(17,21,18,0.3)] motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            
            <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-b from-[#f4f6f2] to-[#e9ede5]">
              <CarImage
                src={carImage(representative)}
                alt={`${enumLabel(type)}: ${carName(representative)}`}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f9a0e]">{enumLabel(type)}</p>
                <h3 className="mt-1 truncate text-lg font-semibold leading-tight tracking-tight text-foreground">{carName(representative)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count > 1 ? `+ ${count - 1} more ${enumLabel(type).toLowerCase()}` : `1 ${enumLabel(type).toLowerCase()} available`}
                </p>
              </div>
              <span
                aria-label="Learn more"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition group-hover:bg-primary group-hover:text-secondary"
              >
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
