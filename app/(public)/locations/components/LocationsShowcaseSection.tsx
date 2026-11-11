"use client";

import { Truck } from "lucide-react";
import { locations } from "@/lib/locations";
import { useState } from "react";
import LocationCard from "./LocationCard";
import LocationDetailCard from "./LocationDetailCard";
import LocationTabs from "./LocationTabs";
export default function LocationsShowcaseSection() {
  const [activeSlug, setActiveSlug] = useState(locations[0].slug);
  const active = locations.find((l) => l.slug === activeSlug) ?? locations[0];

  return (
    <section className="bg-background pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        {locations.length > 1 && <LocationTabs locations={locations} activeSlug={activeSlug} onSelect={setActiveSlug} />}

        <div className="mt-5">
          <LocationDetailCard location={active} />
        </div>

        {locations.length > 1 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {locations.map((location) => (
              <LocationCard
                key={location.slug}
                location={location}
                active={location.slug === activeSlug}
                onSelect={() => setActiveSlug(location.slug)}
              />
            ))}
          </div>
        )}

        <div className="relative mt-6 flex items-start gap-5 overflow-hidden rounded-3xl bg-secondary p-6 text-secondary-foreground sm:items-center sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />
          <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Truck className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="relative">
            <h2 className="text-lg font-bold tracking-tight text-white">Accident replacement: delivered statewide</h2>
            <p className="mt-1 text-sm leading-6 text-white/65">
              Accident replacement vehicles are delivered Tasmania-wide, so wherever you are in the state, we can get one to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}