"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CarCard, { Car } from "@/components/CarCard";
import { cars } from "@/lib/cars";

const filters = ["All", "Compact Cars", "Sedans", "SUVs", "Commercial", "Electric"];



export default function FleetSection() {
  const [active, setActive] = useState("All");
  const visibleCars = active === "All" ? cars : cars.filter((car) => car.type === active);

  return (
    <section className="bg-card py-27.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="max-w-140 text-[2.4rem] font-bold leading-[1.4] tracking-tight text-foreground">
              Find the right vehicle for your journey.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-5 text-muted-foreground">
              Choose from a growing range of vehicles for travel, business and everyday needs.
            </p>
          </div>

          <Link
            href="/fleet"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9.5 shrink-0 gap-2 rounded-[14px] border-border bg-card px-5.5 text-xs font-medium text-foreground shadow-none hover:bg-muted has-[>svg]:px-5.5"
            )}
          >
            View full fleet
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              type="button"
              variant="outline"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
              className={cn(
                "h-9.5 rounded-[10px] px-4 text-xs font-medium text-foreground shadow-none",
                active === filter
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>

        {visibleCars.length === 0 && (
          <p className="mt-11.25 text-sm text-muted-foreground">
            No vehicles in this category yet.
          </p>
        )}

        <div className="mt-11.25 grid gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCars.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}