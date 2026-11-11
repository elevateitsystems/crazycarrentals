"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Cog, DoorClosed, Fuel, Gauge, Palette, ShieldCheck, Tag, UserRound, Users, type LucideIcon } from "lucide-react";
import CarImage from "@/components/CarImage";
import BrandLoader from "@/components/BrandLoader";
import { ErrorState } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { ADMIN_SESSION_PATH } from "@/lib/api/config";
import { adminApi, carsApi } from "@/lib/api/services";
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
  const gallery = images;
  const features = carFeatures(car);
  // Only the driver's name is shown: the licence details in `driverInfo` are personal and stay private.
  const driverAssigned = Boolean(car.driverInfoId || car.driverInfo);
  const driverName = car.driverInfo?.name?.trim() || lookup.data || null;
  const specs: { icon: LucideIcon; label: string; value: string | number | undefined }[] = [
    { icon: Tag, label: "Type", value: enumLabel(car.carType) },
    { icon: CalendarDays, label: "Year", value: car.year },
    { icon: Palette, label: "Color", value: car.color },
    { icon: Users, label: "Seats", value: car.totalSeat },
    { icon: DoorClosed, label: "Doors", value: car.doors },
    { icon: Cog, label: "Transmission", value: enumLabel(car.transmission) },
    { icon: Fuel, label: "Fuel", value: enumLabel(car.fuelType) },
    { icon: Gauge, label: "Mileage", value: car.mileage != null ? `${Number(car.mileage).toLocaleString()} km` : undefined },
  ];

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <Link href="/fleet" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-foreground/30 hover:text-foreground">
          <ArrowLeft className="size-3.5" aria-hidden /> Back to fleet
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          {/* Gallery. On phones the order is gallery, booking panel, details; on desktop the panel sits in the right column. */}
          <div className="min-w-0 lg:col-start-1">
            <div>
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-[#eef0ec] shadow-[0_30px_60px_-34px_rgba(17,21,18,0.4)] ring-1 ring-black/5">
                <CarImage src={gallery[Math.min(selected, gallery.length - 1)]} alt={carName(car)} />
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-label={`Show image ${i + 1}`}
                      aria-current={i === selected}
                      className={cn(
                        "relative h-18 w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-[#eef0ec] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        i === selected ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <CarImage src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking panel */}
          <aside className="order-none rounded-3xl border border-border bg-white p-6 shadow-[0_24px_50px_-30px_rgba(17,21,18,0.35)] sm:p-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f9a0e]">{enumLabel(car.carType)}</p>
            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-foreground">{carName(car)}</h1>
            <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-secondary px-5 py-4 text-secondary-foreground">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-secondary-foreground/60">From</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-primary">{money(car.pricePerDay)}</span>
                  <span className="text-sm text-secondary-foreground/60">/day</span>
                </p>
              </div>
              <span className="mb-1 text-right text-xs leading-5 text-secondary-foreground/60">GST included.<br />Free cancellation up to 24 hrs before pickup.</span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-2.5">
              {specs
                .filter(({ value }) => value !== undefined && value !== "")
                .map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/70 px-3.5 py-3">
                    <Icon className="size-[18px] shrink-0 text-[#4f9a0e]" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                      <dd className="truncate text-sm font-semibold text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
            </dl>

            <div className="mt-3 flex items-center gap-3.5 rounded-xl border border-border p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <UserRound className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Driver</p>
                <p className={cn("text-base font-semibold", driverName ? "text-foreground" : "text-muted-foreground")}>
                  {driverName ?? (driverAssigned ? (lookup.loading && needsLookup ? "Loading driver…" : "Driver assigned") : "No driver assigned")}
                </p>
              </div>
            </div>

            {car.safetyRatings && (
              <p className="mt-4 flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 shrink-0 text-[#4f9a0e]" aria-hidden />
                <span className="text-muted-foreground">Safety rating:</span>
                <span className="font-semibold text-foreground">{String(car.safetyRatings)}</span>
              </p>
            )}

            <Link
              href={`/book/${car.id}`}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.9)] transition hover:bg-primary/90 motion-safe:hover:-translate-y-0.5"
            >
              Book this vehicle
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </aside>

          {(car.description || features.length > 0) && (
            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <div className="rounded-2xl border border-border bg-white p-6 sm:p-7">
                {car.description && (
                  <>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">About this vehicle</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{car.description}</p>
                  </>
                )}
                {features.length > 0 && (
                  <>
                    <h2 className={cn("text-base font-semibold tracking-tight text-foreground", car.description && "mt-6 border-t border-border pt-6")}>Features</h2>
                    <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[#4f9a0e]">
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
