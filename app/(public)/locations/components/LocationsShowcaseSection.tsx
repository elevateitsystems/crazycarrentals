"use client";

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
        <LocationTabs locations={locations} activeSlug={activeSlug} onSelect={setActiveSlug} />

        <div className="mt-5">
          <LocationDetailCard location={active} />
        </div>

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
      </div>
    </section>
  );
}