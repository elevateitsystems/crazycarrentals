"use client";

import { Suspense } from "react";
import Link from "next/link";
import { EmptyState, ErrorState, Spinner } from "@/components/Feedback";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useAsync } from "@/hooks/use-async";
import { useQueryState } from "@/hooks/use-query-state";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingCustomer, bookingReference, bookingTotal, latestPayment } from "@/lib/booking";
import { carName, enumLabel, formatDateTime, money } from "@/lib/format";
import { BOOKING_STATUSES, FilterSelect, PAYMENT_OPTIONS, PAYMENT_STATUSES, SearchBox, selectClass } from "../components/ListControls";

const PAGE_SIZE = 10;
const FILTERS = ["searchTerm", "status", "paymentOption", "paymentStatus", "sort"] as const;
const SORTS = {
  "": { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  oldest: { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  "total-desc": { label: "Highest total", sortBy: "totalPrice", sortOrder: "desc" },
  "total-asc": { label: "Lowest total", sortBy: "totalPrice", sortOrder: "asc" },
} as const;

function Bookings() {
  const { values: f, page, set } = useQueryState(FILTERS);
  const sort = SORTS[f.sort as keyof typeof SORTS] ?? SORTS[""];

  const { data, error, loading, reload } = useAsync(async () => {
    const res = await adminApi.bookings({
      page,
      limit: PAGE_SIZE,
      searchTerm: f.searchTerm,
      status: f.status,
      paymentOption: f.paymentOption,
      paymentStatus: f.paymentStatus,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
    return { items: toList<Booking>(res.data), meta: res.meta };
  }, JSON.stringify([page, f]));

  const filtered = Boolean(f.searchTerm || f.status || f.paymentOption || f.paymentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="mt-2 text-muted-foreground">Review reservations, confirm holds and collect desk payments.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <SearchBox value={f.searchTerm} onSearch={(searchTerm) => set({ searchTerm })} placeholder="Search customer, email or reference" />
        <FilterSelect label="Booking status" value={f.status} options={BOOKING_STATUSES} allLabel="All statuses" onChange={(status) => set({ status })} />
        <FilterSelect label="Payment option" value={f.paymentOption} options={PAYMENT_OPTIONS} allLabel="All payment options" onChange={(paymentOption) => set({ paymentOption })} />
        <FilterSelect label="Payment status" value={f.paymentStatus} options={PAYMENT_STATUSES} allLabel="All payment statuses" onChange={(paymentStatus) => set({ paymentStatus })} />
        <select aria-label="Sort" value={f.sort} onChange={(e) => set({ sort: e.target.value })} className={`${selectClass} w-40`}>
          {Object.entries(SORTS).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-card">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="px-6">
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Pickup</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.items.map((b) => {
                  const payment = latestPayment(b);
                  return (
                    <tr key={b.id} className="transition-colors hover:bg-muted/30">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        <Link href={`/admin/bookings/${b.id}`} className="hover:underline">{bookingReference(b)}</Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{bookingCustomer(b) || "—"}</span>
                          <span className="text-xs text-muted-foreground">{b.customer?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {b.car ? carName(b.car) : "—"}
                        {b.car?.plate && <span className="block text-xs">{b.car.plate}</span>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{formatDateTime(b.pickupDate, b.pickupTime)}</td>
                      <td className="px-6 py-4 font-medium">{money(bookingTotal(b))}</td>
                      <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={payment?.status} />
                          <span className="text-xs text-muted-foreground">{enumLabel(payment?.paymentOption)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!data?.items.length && <EmptyState>{filtered ? "No bookings match these filters." : "No bookings yet."}</EmptyState>}
          </div>
        )}
      </div>
      <Pagination meta={data?.meta} onPage={(p) => set({ page: p })} />
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Bookings />
    </Suspense>
  );
}
