"use client";

import CarCard from "@/components/CarCard";
import { CardGridSkeleton, EmptyState, ErrorState, Refreshing } from "@/components/Feedback";
import Pagination from "@/components/Pagination";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { carsApi } from "@/lib/api/services";
import type { Car as ApiCar } from "@/lib/api/types";
import { toCar } from "@/lib/cars";
import { enumLabel } from "@/lib/format";
import { X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const sortOptions = [
  { label: "Price: Low to High", value: "pricePerDay:asc" },
  { label: "Price: High to Low", value: "pricePerDay:desc" },
];
const PAGE_SIZE = 12;

export default function FleetListing() {
  const params = useSearchParams();
  const [sort, setSort] = useState("pricePerDay:asc");
  const [page, setPage] = useState(1);

  // Trip details from the reservation form; when present the backend's availability search is used.
  const trip = useMemo(() => {
    const keys = ["pickupLocation", "pickupDate", "pickupTime", "returnDate", "returnTime", "age", "returnLocation", "airportShuttle"] as const;
    const out: Record<string, string> = {};
    for (const k of keys) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
    return out;
  }, [params]);
  const hasTrip = Boolean(trip.pickupDate && trip.returnDate);
  // Set by the homepage's Vehicle Types cards (/rent-a-car?carType=SEDAN).
  const carType = params.get("carType") ?? undefined;

  const [sortBy, sortOrder] = sort.split(":");
  const { returnLocation: _r, airportShuttle: _a, ...searchTrip } = trip; // booking-only params
  void _r;
  void _a;
  const query = {
    ...(hasTrip ? searchTrip : {}),
    carType,
    sortBy,
    sortOrder,
    page,
    limit: PAGE_SIZE,
  };
  const results = useAsync(async () => {
    const res = hasTrip ? await carsApi.search(query) : await carsApi.list(query);
    return { cars: toList<ApiCar>(res.data), meta: res.meta };
  }, JSON.stringify(query));

  const visibleCars = (results.data?.cars ?? []).map(toCar);
  const total = results.data?.meta?.total ?? visibleCars.length;

  return (
    <section className="bg-background pb-16 pt-2 md:pb-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-[0_1px_2px_rgba(17,21,18,0.04)] sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="text-base font-bold text-foreground">{results.loading && !results.refreshing ? "…" : total}</span>{" "}
              {total === 1 ? "vehicle" : "vehicles"} {hasTrip ? "available for your dates" : "available"}
            </p>
            {carType && (
              <Link
                href="/rent-a-car"
                aria-label={`Remove ${enumLabel(carType)} filter`}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary transition-opacity hover:opacity-85"
              >
                {enumLabel(carType)} <X className="size-3.5" aria-hidden />
              </Link>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort:
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-border bg-white px-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.loading && !results.refreshing ? (
          <CardGridSkeleton label="Loading vehicles…" count={PAGE_SIZE} className="mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6" />
        ) : results.error ? (
          <ErrorState message={results.error} onRetry={results.reload} />
        ) : visibleCars.length === 0 ? (
          <EmptyState>{hasTrip ? "No vehicles are available for those dates. Try different dates or times." : "No vehicles found."}</EmptyState>
        ) : (
          <Refreshing active={results.refreshing} className="mt-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {visibleCars.map((car) => (
                <CarCard key={car.id} car={car} trip={hasTrip ? trip : undefined} />
              ))}
            </div>
            <Pagination meta={results.data?.meta} onPage={setPage} />
          </Refreshing>
        )}
      </div>
    </section>
  );
}
