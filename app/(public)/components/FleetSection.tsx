"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CarCard, { Car } from "@/components/CarCard";

const filters = ["All", "Compact Cars", "Sedans", "SUVs", "Commercial", "Electric"];

const cars: Car[] = [
  { slug: "suzuki-baleno", name: "Suzuki Baleno", category: "Compact Hatch", type: "Compact Cars", image: "/car-1.jpg", price: 59, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
  { slug: "mg3", name: "MG3", category: "Compact Hatch", type: "Compact Cars", image: "/car-1.jpg", price: 55, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
  { slug: "toyota-corolla-hatch", name: "Toyota Corolla Hatch", category: "Small Car", type: "Compact Cars", image: "/car-1.jpg", price: 69, seats: 5, doors: 5, transmission: "Automatic", fuel: "Hybrid" },
  { slug: "toyota-corolla-sedan", name: "Toyota Corolla Sedan", category: "Sedan", type: "Sedans", image: "/car-2.jpg", price: 74, seats: 5, doors: 4, transmission: "Automatic", fuel: "Hybrid" },
  { slug: "hyundai-venue", name: "Hyundai Venue", category: "Small SUV", type: "SUVs", image: "/car-3.jpg", price: 72, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
  { slug: "kia-stonic", name: "Kia Stonic", category: "Small SUV", type: "SUVs", image: "/car-3.jpg", price: 74, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol" },
];

export default function FleetSection() {
  const [active, setActive] = useState("All");
  const visibleCars = active === "All" ? cars : cars.filter((car) => car.type === active);

  return (
    <section className="bg-card px-6 py-27.5">
      <div className="mx-auto max-w-280">
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