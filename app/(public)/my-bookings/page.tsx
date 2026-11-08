"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Plus } from "lucide-react";
import CarImage from "@/components/CarImage";
import { CardGridSkeleton, ErrorState } from "@/components/Feedback";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { bookingsApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingReference, bookingTotal, latestPayment } from "@/lib/booking";
import { carImage, carName, enumLabel, formatDate, money } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "upcoming", label: "Upcoming", match: (s?: string) => s === "PENDING" || s === "CONFIRMED", empty: "No upcoming bookings." },
  { key: "past", label: "Completed", match: (s?: string) => s === "COMPLETED", empty: "No completed rentals yet." },
  { key: "cancelled", label: "Cancelled", match: (s?: string) => s === "CANCELLED", empty: "No cancelled bookings." },
] as const;

function BookingCard({ b }: { b: Booking }) {
  const payment = latestPayment(b);
  const img = carImage(b.car);
  return (
    <Link
      href={`/my-bookings/${b.id}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:grid-cols-[15rem_1fr]"
    >
      <div className="relative h-48 bg-muted sm:h-full sm:min-h-44">
        <CarImage src={img} alt={b.car ? carName(b.car) : "Vehicle"} className="transition-transform duration-500 group-hover:scale-105" />
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{bookingReference(b)}</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">{b.car ? carName(b.car) : "Vehicle booking"}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={b.status} />
            <StatusBadge status={payment?.status} prefix="Payment:" />
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            { label: "Pickup", date: formatDate(b.pickupDate), time: b.pickupTime, place: b.pickupLocation },
            { label: "Return", date: formatDate(b.returnDate), time: b.returnTime, place: b.returnLocation },
          ].map((t) => (
            <div key={t.label} className="flex gap-2.5">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.label}</p>
                <p className="font-medium text-foreground">{t.date}{t.time ? ` · ${t.time}` : ""}</p>
                {t.place && (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" aria-hidden /> {t.place}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total{b.rentalDays ? ` · ${b.rentalDays} day${b.rentalDays === 1 ? "" : "s"}` : ""}</p>
            <p className="text-xl font-bold tracking-tight text-foreground">{money(bookingTotal(b))}</p>
            {payment?.paymentOption && <p className="text-xs text-muted-foreground">{enumLabel(payment.paymentOption)}</p>}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            View details <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function MyBookings() {
  const { data, error, loading, reload } = useAsync(async () => toList<Booking>((await bookingsApi.mine()).data), "mine");
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("upcoming");

  const groups = useMemo(
    () =>
      Object.fromEntries(TABS.map((t) => [t.key, (data ?? []).filter((b) => t.match(b.status))])) as Record<(typeof TABS)[number]["key"], Booking[]>,
    [data],
  );
  const active = TABS.find((t) => t.key === tab)!;
  const rows = groups[tab];

  return (
    <div className="bg-muted/40">
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6 sm:py-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">My account</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">My Bookings</h1>
            <p className="mt-2 text-[15px] text-secondary-foreground/70">Track, review and manage your rentals.</p>
          </div>
          <Link href="/rent-a-car" className={cn(buttonVariants(), "h-11 gap-2 rounded-xl px-5 text-sm font-semibold")}>
            <Plus className="size-4" aria-hidden /> New booking
          </Link>
        </div>
      </section>

      <section className="mx-auto min-h-[50vh] max-w-5xl px-4 py-8 sm:px-6">
        {loading ? (
          <CardGridSkeleton count={3} label="Loading your bookings…" className="mt-0 sm:grid-cols-1 xl:grid-cols-1" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-bold tracking-tight">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">When you book a vehicle it will show up here, with everything you need for pickup.</p>
            <Link href="/rent-a-car" className={cn(buttonVariants(), "mt-6 h-11 rounded-xl px-6 text-sm font-semibold")}>
              Find a car
            </Link>
          </div>
        ) : (
          <>
            <div role="tablist" aria-label="Booking status" className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:w-fit">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-medium sm:gap-2 sm:px-4 sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none",
                    tab === t.key ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                  <span className={cn("rounded-full px-1.5 text-xs", tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted")}>{groups[t.key].length}</span>
                </button>
              ))}
            </div>

            {rows.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-border bg-card py-14 text-center text-sm text-muted-foreground">{active.empty}</p>
            ) : (
              <ul role="tabpanel" className="mt-6 space-y-5">
                {rows.map((b) => (
                  <li key={b.id}>
                    <BookingCard b={b} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <MyBookings />
    </RequireAuth>
  );
}
