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
    <section className="bg-background pb-18 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
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

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Truck className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">Accident replacement: delivered statewide</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Regular car rentals operate from our Launceston branch. Accident replacement vehicles are delivered Tasmania-wide, so wherever you are in the state, we can get one to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}