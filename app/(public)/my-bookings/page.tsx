"use client";

import Link from "next/link";
import { ErrorState, EmptyState, Spinner } from "@/components/Feedback";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { bookingsApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingTotal } from "@/lib/booking";
import { carName, formatDateTime, money } from "@/lib/format";
import { cn } from "@/lib/utils";

function MyBookings() {
  const { data, error, loading, reload } = useAsync(async () => toList<Booking>((await bookingsApi.mine()).data), "mine");

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your upcoming and past rentals.</p>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data?.length ? (
        <div className="mt-6 rounded-xl border bg-card p-8 text-center">
          <EmptyState>You have no bookings yet.</EmptyState>
          <Link href="/rent-a-car" className={cn(buttonVariants(), "h-9 px-4")}>
            Find a car
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {data.map((b) => (
            <li key={b.id}>
              <Link
                href={`/my-bookings/${b.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 transition hover:border-primary/60"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{b.car ? carName(b.car) : "Vehicle booking"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(b.pickupDate, b.pickupTime)} → {formatDateTime(b.returnDate, b.returnTime)}
                  </p>
                  {b.pickupLocation && <p className="text-xs text-muted-foreground">{b.pickupLocation}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{money(bookingTotal(b))}</span>
                  <StatusBadge status={b.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <MyBookings />
    </RequireAuth>
  );
}
