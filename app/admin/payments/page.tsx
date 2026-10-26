"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { EmptyState, ErrorState, Notice, Refreshing, Spinner, TableSkeleton } from "@/components/Feedback";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAsync } from "@/hooks/use-async";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryState } from "@/hooks/use-query-state";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { adminActions, bookingCustomer, bookingReference, latestPayment } from "@/lib/booking";
import { enumLabel, formatTimestamp, money } from "@/lib/format";
import { FilterSelect, PAYMENT_OPTIONS, PAYMENT_STATUSES, SearchBox } from "../components/ListControls";

const PAGE_SIZE = 10;
const FILTERS = ["searchTerm", "paymentOption", "paymentStatus"] as const;

function StripeStatus() {
  const { data, error, loading } = useAsync(async () => (await adminApi.paymentConfig()).data, "stripe");
  if (loading) return null;
  const key = data?.publishableKey;
  const mode = key?.startsWith("pk_live_") ? "live" : key?.startsWith("pk_test_") ? "test" : null;
  return (
    <Notice kind={mode ? "success" : "error"}>
      {mode ? (
        <>
          <span className="font-semibold">Stripe is connected ({mode} mode).</span> Customers pay by card when they choose Pay Now; the
          backend verifies each payment with Stripe before confirming the booking. Secret keys stay on the server.
        </>
      ) : (
        <>Stripe isn&apos;t configured on the backend{error ? `: ${error}` : ""}. Pay Now bookings can&apos;t take card payments until it is.</>
      )}
    </Notice>
  );
}

function Payments() {
  const { values: f, page, set } = useQueryState(FILTERS);
  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const summary = useAsync(async () => (await adminApi.bookingSummary()).data, "summary");
  const list = useAsync(async () => {
    const res = await adminApi.bookings({
      page,
      limit: PAGE_SIZE,
      searchTerm: f.searchTerm,
      paymentOption: f.paymentOption,
      paymentStatus: f.paymentStatus,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    return { items: toList<Booking>(res.data), meta: res.meta };
  }, JSON.stringify([page, f]));

  const collect = (b: Booking) =>
    run(async () => {
      const amount = money(latestPayment(b)?.amount ?? b.totalPrice);
      if (!(await confirm({ title: `Record desk payment of ${amount}?`, description: `${bookingReference(b)} · ${bookingCustomer(b)}. Only do this once the customer has paid.`, confirmLabel: "Record payment", destructive: false }))) return;
      setFlash(null);
      setRecordingId(b.id);
      try {
        const res = await adminApi.collectPayment(b.id);
        setFlash({ kind: "success", text: res.message ?? "Payment recorded." });
        list.reload();
        summary.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not record the payment." });
      } finally {
        setRecordingId(null);
      }
    });

  const s = summary.data;
  const tiles = [
    { label: "Collected revenue", value: money(s?.collectedRevenue), status: "COMPLETED" },
    { label: "Pay Now bookings", value: s?.payNow?.toLocaleString() ?? "—", option: "PAY_NOW" },
    { label: "Pay at desk bookings", value: s?.payAtDesk?.toLocaleString() ?? "—", option: "PAY_AT_DESK" },
    { label: "Awaiting desk payment", value: s?.awaitingDeskPayment?.toLocaleString() ?? "—", status: "PENDING_AT_DESK" },
  ];
  const filtered = Boolean(f.searchTerm || f.paymentOption || f.paymentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-2 text-muted-foreground">Card payments, desk payments and refunds across all bookings.</p>
      </div>

      <StripeStatus />

      {summary.error ? (
        <ErrorState message={summary.error} onRetry={summary.reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => set({ paymentStatus: t.status ?? "", paymentOption: t.option ?? "" })}
              className="text-left"
            >
              <Card className="h-full gap-1 border-l-4 border-l-primary py-5 transition-colors hover:bg-muted/40">
                <CardContent className="px-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{summary.loading ? "…" : t.value}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <SearchBox value={f.searchTerm} onSearch={(searchTerm) => set({ searchTerm })} placeholder="Search customer, email or reference" />
        <FilterSelect label="Payment option" value={f.paymentOption} options={PAYMENT_OPTIONS} allLabel="All payment options" onChange={(paymentOption) => set({ paymentOption })} />
        <FilterSelect label="Payment status" value={f.paymentStatus} options={PAYMENT_STATUSES} allLabel="All payment statuses" onChange={(paymentStatus) => set({ paymentStatus })} />
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={list.refreshing} className="rounded-xl border bg-card">
        {list.loading && !list.refreshing ? (
          <TableSkeleton />
        ) : list.error ? (
          <div className="px-6"><ErrorState message={list.error} onRetry={list.reload} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Booking</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Option</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Booking status</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.data?.items.map((b) => {
                  const p = latestPayment(b);
                  return (
                    <tr key={b.id} className="transition-colors hover:bg-muted/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link href={`/admin/bookings/${b.id}`} className="font-medium hover:underline">{bookingReference(b)}</Link>
                        <span className="block text-xs text-muted-foreground">{formatTimestamp(b.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{bookingCustomer(b) || "—"}</span>
                        <span className="block text-xs text-muted-foreground">{b.customer?.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        {enumLabel(p?.paymentOption) || "—"}
                        {p?.paymentMethod && <span className="block text-xs text-muted-foreground">{p.paymentMethod}</span>}
                      </td>
                      <td className="px-6 py-4 font-medium">{money(p?.amount ?? b.totalPrice)}</td>
                      <td className="px-6 py-4"><StatusBadge status={p?.status} /></td>
                      <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-4 text-right">
                        {adminActions(b).collect ? (
                          <Button size="sm" onClick={() => collect(b)} disabled={busy} loading={recordingId === b.id}>
                            {recordingId === b.id ? "Recording…" : "Record desk payment"}
                          </Button>
                        ) : (
                          <Link href={`/admin/bookings/${b.id}`} className="text-xs font-medium text-primary hover:underline">Details</Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!list.data?.items.length && (
              <EmptyState>
                {filtered ? (
                  <span className="inline-flex items-center gap-1.5"><CircleAlert className="size-4" /> No payments match these filters.</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" /> No payments yet.</span>
                )}
              </EmptyState>
            )}
          </div>
        )}
      </Refreshing>
      <Pagination meta={list.data?.meta} onPage={(p) => set({ page: p })} />
      {confirmDialog}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Payments />
    </Suspense>
  );
}
