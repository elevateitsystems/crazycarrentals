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
        <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
        <span className="sr-only">Loading vehicle types…</span>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!categories.length) return <EmptyState>Our vehicle range will appear here soon.</EmptyState>;

  return (
    <ul className={`grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] ${className ?? ""}`}>
      {categories.map(({ type, representative, count }) => (
        <li key={type}>
          <Link
            href={`/rent-a-car?carType=${encodeURIComponent(type)}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CarImage
              src={carImage(representative)}
              alt={`${enumLabel(type)}: ${carName(representative)}`}
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-xl font-bold tracking-tight">{enumLabel(type)}</h3>
              <p className="mt-0.5 truncate text-sm text-white/75">
                {carName(representative)}
                {count > 1 ? ` + ${count - 1} more` : ""}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
