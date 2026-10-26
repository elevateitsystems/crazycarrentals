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
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";


const transmissions = [
  { label: "All", value: "All" },
  { label: "Auto", value: "AUTOMATIC" },
  { label: "Manual", value: "MANUAL" },
];
const sortOptions = [
  { label: "Price: Low to High", value: "pricePerDay:asc" },
  { label: "Price: High to Low", value: "pricePerDay:desc" },
];
const PAGE_SIZE = 9;

const MIN_PRICE = 50;
const MAX_PRICE = 200;

function FilterOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/50 bg-primary/10 font-semibold text-foreground shadow-sm"
          : "border-transparent text-foreground/75 hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function FilterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      {children}
    </h3>
  );
}

export default function FleetListing() {
  const params = useSearchParams();
  const [type, setType] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState("pricePerDay:asc");
  const [page, setPage] = useState(1);

  // Trip details from the home/search form; when present the backend's availability search is used.
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

  // Unfiltered fetch, only used to build the vehicle-type options from real data.
  const options = useAsync(async () => toList<ApiCar>((await carsApi.list({ limit: 100 })).data), "options");
  const typeOptions = useMemo(
    () => [...new Set((options.data ?? []).map((c) => c.carType).filter(Boolean) as string[])],
    [options.data],
  );

  const [sortBy, sortOrder] = sort.split(":");
  const { returnLocation: _r, airportShuttle: _a, ...searchTrip } = trip; // booking-only params
  void _r;
  void _a;
  const query = {
    ...(hasTrip ? searchTrip : {}),
    carType: type === "All" ? undefined : type,
    transmission: transmission === "All" ? undefined : transmission,
    maxPrice: maxPrice < MAX_PRICE ? maxPrice : undefined,
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

  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };
  const setTypeF = change(setType);
  const setTransmissionF = change(setTransmission);
  const setMaxPriceF = change(setMaxPrice);
  const setSortF = change(setSort);

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:px-6 lg:px-8">
        {/* Filters */}
        <aside className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:w-72 sm:shrink-0 lg:sticky lg:top-24">
          <div className="flex items-center gap-2.5 border-b border-border pb-4 text-base font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-primary" />
            Filters
          </div>

          <div className="mt-5">
            <FilterTitle>Vehicle type</FilterTitle>
            <div className="space-y-1.5">
              {["All", ...typeOptions].map((item) => (
                <FilterOption key={item} active={type === item} onClick={() => setTypeF(item)}>
                  {item === "All" ? "All" : enumLabel(item)}
                </FilterOption>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <FilterTitle>Transmission</FilterTitle>
            <div className="space-y-1.5">
              {transmissions.map((item) => (
                <FilterOption
                  key={item.value}
                  active={transmission === item.value}
                  onClick={() => setTransmissionF(item.value)}
                >
                  {item.label}
                </FilterOption>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <FilterTitle>Max price / day</FilterTitle>
            <p className="text-2xl font-bold tracking-tight text-foreground">${maxPrice}</p>
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPriceF(Number(e.target.value))}
              aria-label="Maximum price per day"
              className="mt-4 h-1.5 w-full cursor-pointer accent-primary"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>${MIN_PRICE}</span>
              <span>${MAX_PRICE}</span>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.loading ? "…" : total}</span>{" "}
              {total === 1 ? "vehicle" : "vehicles"} {hasTrip ? "available for your dates" : "available"}
            </p>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort:
              <select
                value={sort}
                onChange={(e) => setSortF(e.target.value)}
                className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <CardGridSkeleton label="Loading vehicles…" count={PAGE_SIZE} />
          ) : results.error ? (
            <ErrorState message={results.error} onRetry={results.reload} />
          ) : visibleCars.length === 0 ? (
            <EmptyState>No vehicles match these filters. Try adjusting them.</EmptyState>
          ) : (
            <Refreshing active={results.refreshing} className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleCars.map((car) => (
                  <CarCard key={car.id} car={car} trip={hasTrip ? trip : undefined} />
                ))}
              </div>
              <Pagination meta={results.data?.meta} onPage={setPage} />
            </Refreshing>
          )}
        </div>
      </div>
    </section>
  );
}