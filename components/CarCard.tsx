import Link from "next/link";
import { ArrowUpRight, Cog, DoorClosed, Fuel, Users, type LucideIcon } from "lucide-react";
import CarImage from "@/components/CarImage";
import { buttonVariants } from "@/components/ui/button";
import type { PublicDetails } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export type Car = {
  id: string;
  name: string;
  category: string;
  type: string;
  image: string;
  price: number;
  basePrice: number;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
  soldOut?: boolean;
  payNowLabel?: string;
  details?: PublicDetails;
};

export default function CarCard({ car, trip }: { car: Car; trip?: Record<string, string> }) {
  const query = trip ? `?${new URLSearchParams(trip)}` : "";
  const bookHref = `/book/${car.id}${query}`;
  const detailsHref = `/fleet/${car.id}${query}`;
  const specs: { icon: LucideIcon; label: string; value: string | number }[] = [
    { icon: Users, label: "Seats", value: car.details?.seats != null ? `${car.details.seats} ${car.details.seats === 1 ? "seat" : "seats"}` : `${car.seats} seats` },
    { icon: DoorClosed, label: "Doors", value: car.details?.doors != null ? `${car.details.doors} ${car.details.doors === 1 ? "door" : "doors"}` : `${car.doors} doors` },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
  ];
  if (car.details?.mileage != null) specs.push({ icon: Fuel, label: "Mileage", value: String(car.details.mileage) });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(17,21,18,0.04)] transition duration-300 hover:border-primary/50 hover:shadow-[0_24px_48px_-24px_rgba(17,21,18,0.35)] motion-safe:hover:-translate-y-1">
      {/* The whole image is a link to the details page. */}
      <Link href={detailsHref} aria-label={`View details for ${car.name}`} className="relative block aspect-[4/3] overflow-hidden bg-[#eef0ec] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary">
        <CarImage src={car.image} alt={car.name} className="transition-transform duration-500 group-hover:scale-105" />
        {car.soldOut && <span className="absolute left-3 top-3 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider text-background">Sold out</span>}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f9a0e]">{car.category}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight text-foreground">{car.name}</h3>

        <dl className="mt-4 grid grid-cols-2 gap-2.5">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-2.5 rounded-xl bg-muted/70 px-3 py-2">
              <Icon className="size-4 shrink-0 text-[#4f9a0e]" aria-hidden />
              <div className="min-w-0">
                <dt className="sr-only">{label}</dt>
                <dd className="truncate text-[13px] font-medium text-foreground">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-5">
          <div className="leading-none">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">From</span>
            <p className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">${car.price}</span>
              <span className="text-xs text-muted-foreground">/day</span>
            </p>
          </div>
        </div>

        {car.payNowLabel && !car.soldOut && <p className="mt-4 text-center text-xs font-semibold text-[#4f9a0e]">{car.payNowLabel}</p>}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link
            href={detailsHref}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl border-foreground/15 bg-white text-sm font-semibold text-foreground shadow-none hover:border-foreground/40 hover:bg-muted")}
          >
            View Details
          </Link>
          {car.soldOut ? (
            <button type="button" disabled className="h-11 cursor-not-allowed rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
              Sold out
            </button>
          ) : (
            <Link
              href={bookHref}
              className={cn(buttonVariants(), "h-11 gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_22px_-10px_rgba(139,214,47,0.9)] hover:bg-primary/90")}
            >
              Book Now
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
