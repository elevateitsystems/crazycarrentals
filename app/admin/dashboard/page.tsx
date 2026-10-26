"use client";

import Link from "next/link";
import { ArrowRight, Car, CircleDollarSign, IdCard, CalendarCheck, Users } from "lucide-react";
import { EmptyState, ErrorState, Spinner } from "@/components/Feedback";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { bookingCustomer, bookingReference, latestPayment } from "@/lib/booking";
import { carName, formatDateTime, money } from "@/lib/format";

const STATUS_ROWS = [
  { key: "pending", status: "PENDING", label: "Pending (awaiting card payment)", bar: "bg-amber-500" },
  { key: "confirmed", status: "CONFIRMED", label: "Confirmed", bar: "bg-primary" },
  { key: "completed", status: "COMPLETED", label: "Completed", bar: "bg-green-600" },
  { key: "cancelled", status: "CANCELLED", label: "Cancelled", bar: "bg-red-500" },
] as const;

const count = (n: unknown) => (typeof n === "number" ? n.toLocaleString() : "—");

export default function DashboardPage() {
  const dashboard = useAsync(async () => (await adminApi.dashboard()).data, "dashboard");
  const summary = useAsync(async () => (await adminApi.bookingSummary()).data, "summary");
  const recent = useAsync(async () => toList<Booking>((await adminApi.bookings({ limit: 5, sortBy: "createdAt", sortOrder: "desc" })).data), "recent");

  const d = dashboard.data;
  const s = summary.data;
  const totalBookings = d?.bookings?.total ?? s?.total ?? 0;

  const tiles = [
    { label: "Revenue collected", value: money(d?.revenue?.collected ?? s?.collectedRevenue), icon: CircleDollarSign, href: "/admin/payments?paymentStatus=COMPLETED" },
    { label: "Bookings", value: count(d?.bookings?.total), icon: CalendarCheck, href: "/admin/bookings" },
    { label: "Vehicles available", value: d?.cars ? `${count(d.cars.available)} / ${count(d.cars.total)}` : "—", icon: Car, href: "/admin/fleet-management" },
    { label: "Customers", value: count(d?.users?.total), icon: Users, href: "/admin/customers" },
    { label: "Drivers", value: count(d?.drivers?.total), icon: IdCard, href: "/admin/drivers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of your car rental business.</p>
      </div>

      {dashboard.loading ? (
        <Spinner />
      ) : dashboard.error ? (
        <ErrorState message={dashboard.error} onRetry={dashboard.reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="group">
              <Card className="h-full gap-1 border-l-4 border-l-primary py-5 transition-colors group-hover:bg-muted/40">
                <CardContent className="px-5">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
                    <Icon className="size-4" />
                  </div>
                  <p className="mt-2 break-words text-2xl font-bold tracking-tight">{value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookings by status</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.loading ? (
              <Spinner className="p-0" />
            ) : dashboard.error ? null : (
              <ul className="space-y-4">
                {STATUS_ROWS.map(({ key, status, label, bar }) => {
                  const n = d?.bookings?.[key] ?? 0;
                  const pct = totalBookings ? Math.round((n / totalBookings) * 100) : 0;
                  return (
                    <li key={key}>
                      <Link href={`/admin/bookings?status=${status}`} className="block rounded-md hover:bg-muted/40">
                        <div className="flex justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-semibold">{n.toLocaleString()}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
                          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.loading ? (
              <Spinner className="p-0" />
            ) : summary.error ? (
              <ErrorState message={summary.error} onRetry={summary.reload} />
            ) : (
              <dl className="divide-y text-sm">
                {[
                  { label: "Paid online (Pay Now)", value: count(s?.payNow), href: "/admin/payments?paymentOption=PAY_NOW" },
                  { label: "Pay at desk", value: count(s?.payAtDesk), href: "/admin/payments?paymentOption=PAY_AT_DESK" },
                  { label: "Awaiting desk payment", value: count(s?.awaitingDeskPayment), href: "/admin/payments?paymentStatus=PENDING_AT_DESK" },
                  { label: "Collected revenue", value: money(s?.collectedRevenue), href: "/admin/payments?paymentStatus=COMPLETED" },
                ].map(({ label, value, href }) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd>
                      <Link href={href} className="inline-flex items-center gap-1 font-semibold hover:underline">
                        {value} <ArrowRight className="size-3.5 text-muted-foreground" />
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent bookings</CardTitle>
          <Link href="/admin/bookings" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent className="px-0">
          {recent.loading ? (
            <Spinner />
          ) : recent.error ? (
            <div className="px-6"><ErrorState message={recent.error} onRetry={recent.reload} /></div>
          ) : !recent.data?.length ? (
            <EmptyState>No bookings yet.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Vehicle</th>
                    <th className="px-6 py-3 font-medium">Pickup</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recent.data.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium"><Link href={`/admin/bookings/${b.id}`} className="hover:underline">{bookingReference(b)}</Link></td>
                      <td className="px-6 py-3">{bookingCustomer(b) || "—"}</td>
                      <td className="px-6 py-3 text-muted-foreground">{b.car ? carName(b.car) : "—"}</td>
                      <td className="px-6 py-3 text-muted-foreground">{formatDateTime(b.pickupDate, b.pickupTime)}</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1.5"><StatusBadge status={b.status} /><StatusBadge status={latestPayment(b)?.status} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
