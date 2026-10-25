"use client";

import CarCard from "@/components/CarCard";
import { EmptyState, ErrorState, Spinner } from "@/components/Feedback";
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
        "w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/40 bg-primary/10 font-semibold text-foreground"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function FilterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
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
      <div className="mx-auto flex flex-col sm:flex-row max-w-7xl px-4 sm:px-6 md:px-0 gap-6 lg:grid-cols-[170px_1fr] lg:items-start">
        {/* Filters */}
        <aside className="w-full sm:w-1/4 rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <SlidersHorizontal className="size-3.5 text-primary" />
            Filters
          </div>

          <div className="mt-5">
            <FilterTitle>Vehicle type</FilterTitle>
            <div className="space-y-1">
              {["All", ...typeOptions].map((item) => (
                <FilterOption key={item} active={type === item} onClick={() => setTypeF(item)}>
                  {item === "All" ? "All" : enumLabel(item)}
                </FilterOption>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <FilterTitle>Transmission</FilterTitle>
            <div className="space-y-1">
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

          <div className="mt-5">
            <FilterTitle>Max price / day</FilterTitle>
            <p className="text-sm font-bold text-primary">${maxPrice}</p>
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPriceF(Number(e.target.value))}
              aria-label="Maximum price per day"
              className="mt-3 h-1 w-full cursor-pointer accent-primary"
            />
            <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground">
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

            <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
              Sort:
              <select
                value={sort}
                onChange={(e) => setSortF(e.target.value)}
                className="h-8 rounded-md border border-border bg-card px-2 text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.loading ? (
            <Spinner label="Loading vehicles…" />
          ) : results.error ? (
            <ErrorState message={results.error} onRetry={results.reload} />
          ) : visibleCars.length === 0 ? (
            <EmptyState>No vehicles match these filters. Try adjusting them.</EmptyState>
          ) : (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleCars.map((car) => (
                  <CarCard key={car.id} car={car} trip={hasTrip ? trip : undefined} />
                ))}
              </div>
              <Pagination meta={results.data?.meta} onPage={setPage} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}