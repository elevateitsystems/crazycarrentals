"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, UserRound } from "lucide-react";
import CarImage from "@/components/CarImage";
import BrandLoader from "@/components/BrandLoader";
import { ErrorState } from "@/components/Feedback";
import { buttonVariants } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { ADMIN_SESSION_PATH } from "@/lib/api/config";
import { adminApi, carsApi } from "@/lib/api/services";
import { FALLBACK_CAR_IMAGE } from "@/lib/cars";
import { carFeatures, carImages, carName, enumLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CarDetail({ id }: { id: string }) {
  const { data, error, loading, reload } = useAsync(async () => (await carsApi.get(id)).data, id);
  const [selected, setSelected] = useState(0);

  // The public car API doesn't include the driver's name (only licence details). Signed-in admins may read
  // driver records, so for them the name is looked up through the admin session; visitors never trigger an admin call.
  const driverId = data?.driverInfoId ?? null;
  const needsLookup = Boolean(driverId && !data?.driverInfo?.name);
  const lookup = useAsync(async () => {
    if (!driverId || !needsLookup) return null;
    const session = await fetch(ADMIN_SESSION_PATH, { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.json())
      .catch(() => null);
    if (!session?.data?.user) return null;
    try {
      return (await adminApi.driver(driverId)).data.name?.trim() || null;
    } catch {
      return null;
    }
  }, `${id}:${driverId}:${needsLookup}`);

  if (loading) return <BrandLoader label="Loading vehicle…" />;
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error ?? "Vehicle not found."} onRetry={reload} />
      </div>
    );
  }

  const car = data;
  const images = carImages(car);
  const gallery = images.length ? images : [FALLBACK_CAR_IMAGE];
  const features = carFeatures(car);
  // Only the driver's name is shown: the licence details in `driverInfo` are personal and stay private.
  const driverAssigned = Boolean(car.driverInfoId || car.driverInfo);
  const driverName = car.driverInfo?.name?.trim() || lookup.data || null;
  const specs: [string, string | number | undefined][] = [
    ["Type", enumLabel(car.carType)],
    ["Year", car.year],
    ["Color", car.color],
    ["Seats", car.totalSeat],
    ["Doors", car.doors],
    ["Transmission", enumLabel(car.transmission)],
    ["Fuel", enumLabel(car.fuelType)],
    ["Mileage", car.mileage != null ? `${Number(car.mileage).toLocaleString()} km` : undefined],
  ];

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link href="/fleet" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to fleet
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
              <CarImage src={gallery[Math.min(selected, gallery.length - 1)]} alt={carName(car)} />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={cn("relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2", i === selected ? "border-primary" : "border-transparent")}
                  >
                    <CarImage src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{enumLabel(car.carType)}</span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{carName(car)}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              From <span className="text-3xl font-bold text-foreground">{money(car.pricePerDay)}</span> /day
            </p>

            {car.description && <p className="mt-4 text-sm leading-6 text-muted-foreground">{car.description}</p>}

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border bg-card p-5 text-sm">
              {specs
                .filter(([, v]) => v !== undefined && v !== "")
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
            </dl>

            <div className="mt-4 flex items-center gap-3.5 rounded-xl border border-border bg-card p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <UserRound className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Driver</p>
                <p className={cn("text-base font-semibold", driverName ? "text-foreground" : "text-muted-foreground")}>
                  {driverName ?? (driverAssigned ? (lookup.loading && needsLookup ? "Loading driver…" : "Driver assigned") : "No driver assigned")}
                </p>
              </div>
            </div>

            {car.safetyRatings && (
              <p className="mt-4 text-sm">
                <span className="text-muted-foreground">Safety rating: </span>
                <span className="font-medium text-foreground">{String(car.safetyRatings)}</span>
              </p>
            )}

            {features.length > 0 && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-primary" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <Link href={`/book/${car.id}`} className={cn(buttonVariants(), "mt-7 h-11 w-full rounded-xl text-sm font-semibold")}>
              Book this vehicle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
