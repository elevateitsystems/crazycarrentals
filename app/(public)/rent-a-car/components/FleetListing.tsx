"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import CarCard, { Car } from "@/components/CarCard";
 
export const cars: Car[] = [
  { slug: "suzuki-baleno", name: "Suzuki Baleno", category: "Compact Hatch", type: "Compact Cars", image: "/car-1.jpg", price: 59, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
  { slug: "mg3", name: "MG3", category: "Compact Hatch", type: "Compact Cars", image: "/car-1.jpg", price: 55, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
  { slug: "toyota-corolla-hatch", name: "Toyota Corolla Hatch", category: "Small Car", type: "Hatchback", image: "/car-1.jpg", price: 69, seats: 5, doors: 5, transmission: "Automatic", fuel: "Hybrid" },
  { slug: "toyota-corolla-sedan", name: "Toyota Corolla Sedan", category: "Sedan", type: "Sedan", image: "/car-2.jpg", price: 74, seats: 5, doors: 4, transmission: "Automatic", fuel: "Hybrid" },
  { slug: "hyundai-venue", name: "Hyundai Venue", category: "Small SUV", type: "SUVs", image: "/car-3.jpg", price: 72, seats: 5, doors: 5, transmission: "Manual", fuel: "Petrol" },
  { slug: "kia-stonic", name: "Kia Stonic", category: "Small SUV", type: "SUVs", image: "/car-3.jpg", price: 74, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
];

const vehicleTypes = ["All", "Compact Cars", "Hatchback", "Sedan", "SUVs", "Premium SUV", "Commercial"];
const transmissions = [
  { label: "All", value: "All" },
  { label: "Auto", value: "Automatic" },
  { label: "Manual", value: "Manual" },
];
const sortOptions = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

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
  const [type, setType] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState("price-asc");

  const visibleCars = useMemo(() => {
    const filtered = cars.filter(
      (car) =>
        (type === "All" || car.type === type) &&
        (transmission === "All" || car.transmission === transmission) &&
        car.price <= maxPrice
    );

    return [...filtered].sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return a.price - b.price;
    });
  }, [type, transmission, maxPrice, sort]);

  return (
    <section className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-280 gap-6 lg:grid-cols-[170px_1fr] lg:items-start">
        {/* Filters */}
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <SlidersHorizontal className="size-3.5 text-primary" />
            Filters
          </div>

          <div className="mt-5">
            <FilterTitle>Vehicle type</FilterTitle>
            <div className="space-y-1">
              {vehicleTypes.map((item) => (
                <FilterOption key={item} active={type === item} onClick={() => setType(item)}>
                  {item}
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
                  onClick={() => setTransmission(item.value)}
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
              onChange={(e) => setMaxPrice(Number(e.target.value))}
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
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{visibleCars.length}</span>{" "}
              {visibleCars.length === 1 ? "vehicle" : "vehicles"} available
            </p>

            <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
              Sort:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
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

          {visibleCars.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              No vehicles match these filters. Try adjusting them.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCars.map((car) => (
                <CarCard key={car.slug} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}