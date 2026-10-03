"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cars } from "../../rent-a-car/components/FleetListing";
import CarCard from "@/components/CarCard";

// Each chip can match several car `type` values
const filters = [
  { label: "All", types: [] as string[] },
  { label: "Compact Cars", types: ["Compact Cars", "Hatchback"] },
  { label: "Sedans", types: ["Sedans", "Sedan"] },
  { label: "SUVs", types: ["SUVs", "Premium SUV"] },
  { label: "Commercial", types: ["Commercial"] },
  { label: "Electric", types: ["Electric"] },
];

export default function FleetSection({ showHeader = true }: { showHeader?: boolean }) {
  const [active, setActive] = useState("All");
  const activeTypes = filters.find((f) => f.label === active)?.types ?? [];
  const visibleCars =
    active === "All" ? cars : cars.filter((car) => activeTypes.includes(car.type));

  return (
    <section className={cn("bg-card px-6", showHeader ? "py-27.5" : "py-12 md:py-16")}>
      <div className="mx-auto max-w-280">
       

        <div className={cn("flex flex-wrap gap-2", showHeader && "mt-8")}>
          {filters.map(({ label }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              aria-pressed={active === label}
              onClick={() => setActive(label)}
              className={cn(
                "h-9.5 rounded-[10px] px-4 text-xs font-medium text-foreground shadow-none",
                active === label
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {label}
            </Button>
          ))}
        </div>

        {visibleCars.length === 0 && (
          <p className="mt-11.25 text-sm text-muted-foreground">
            No vehicles in this category yet.
          </p>
        )}

        <div className="mt-8 grid gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCars.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}