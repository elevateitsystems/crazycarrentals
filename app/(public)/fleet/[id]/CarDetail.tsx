"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Briefcase, Check, Cog, DoorClosed, Gauge, Snowflake, UserRound, Users, BadgePercent, type LucideIcon } from "lucide-react";
import CarImage from "@/components/CarImage";
import BrandLoader from "@/components/BrandLoader";
import { ErrorState } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { carsApi } from "@/lib/api/services";
import { carImages, carName, enumLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CarDetail({ id }: { id: string }) {
  const params = useSearchParams();
  const pickupDate = params.get("pickupDate") ?? "";
  const returnDate = params.get("returnDate") ?? "";
  const tripQuery = pickupDate && returnDate ? { pickupDate, returnDate } : undefined;
  const { data, error, loading, reload } = useAsync(async () => (await carsApi.get(id, tripQuery)).data, `${id}:${pickupDate}:${returnDate}`);
  const [selected, setSelected] = useState(0);

  if (loading) return <BrandLoader label="Loading vehicle…" />;
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error ?? "Vehicle not found."} onRetry={reload} />
      </div>
    );
  }

  const car = data;
  const gallery = carImages(car);
  const d = car.publicDetails;
  const soldOut = car.soldOut === true;
  const bookHref = `/book/${car.id}${tripQuery ? `?${params.toString()}` : ""}`;
  // Public view shows only publicDetails: no year, colour, plate, raw mileage, safety rating or description.
  const specs: { icon: LucideIcon; label: string; value: string | undefined }[] = [
    { icon: Users, label: "Seats", value: d?.seats != null ? `${d.seats} people` : undefined },
    { icon: DoorClosed, label: "Doors", value: d?.doors != null ? `${d.doors} doors` : undefined },
    { icon: Briefcase, label: "Suitcases", value: d?.suitcases != null ? `${d.suitcases} suitcases` : undefined },
    { icon: Cog, label: "Transmission", value: d?.transmission ? enumLabel(d.transmission) : undefined },
    { icon: Gauge, label: "Mileage", value: d?.mileage != null ? String(d.mileage) : undefined },
    { icon: Snowflake, label: "Air conditioning", value: d?.airConditioning ? "Air-condition" : undefined },
    { icon: UserRound, label: "Minimum driving age", value: d?.minimumDriverAge != null ? `Minimum Driving Age ${d.minimumDriverAge} years old` : undefined },
  ];

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <Link href="/fleet" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-foreground/30 hover:text-foreground">
          <ArrowLeft className="size-3.5" aria-hidden /> Back to fleet
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          <div className="min-w-0 lg:col-start-1">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-[#eef0ec] shadow-[0_30px_60px_-34px_rgba(17,21,18,0.4)] ring-1 ring-black/5">
              <CarImage src={gallery[Math.min(selected, gallery.length - 1)]} alt={carName(car)} />
              {soldOut && <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider text-background">Sold out</span>}
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

          <aside className="rounded-3xl border border-border bg-white p-6 shadow-[0_24px_50px_-30px_rgba(17,21,18,0.35)] sm:p-7 lg:col-start-2 lg:row-start-1 lg:self-start lg:sticky lg:top-24">
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
                .filter(({ value }) => value)
                .map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/70 px-3.5 py-3">
                    <Icon className="size-[18px] shrink-0 text-[#4f9a0e]" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-semibold text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
            </dl>

            {(d?.includedCover || d?.protectionNote) && (
              <div className="mt-3 space-y-2 rounded-xl border border-border p-4 text-sm">
                {d.includedCover && (
                  <p className="flex items-start gap-2 font-medium text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#4f9a0e]" aria-hidden /> {d.includedCover}
                  </p>
                )}
                {d.protectionNote && <p className="text-muted-foreground">{d.protectionNote}</p>}
              </div>
            )}

            {car.payNowLabel && !soldOut && (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <BadgePercent className="size-4 text-[#4f9a0e]" aria-hidden /> {car.payNowLabel}
              </p>
            )}

            {soldOut ? (
              <button type="button" disabled className="mt-6 inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
                Sold out
              </button>
            ) : (
              <Link
                href={bookHref}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_12px_26px_-10px_rgba(139,214,47,0.9)] transition hover:bg-primary/90 motion-safe:hover:-translate-y-0.5"
              >
                Book this vehicle
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
