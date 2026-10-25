"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ErrorState, Notice, Spinner } from "@/components/Feedback";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirm } from "@/hooks/use-confirm";
import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";
import { bookingReference, bookingTotal, canCancel, latestPayment } from "@/lib/booking";
import { carName, enumLabel, formatDateTime, money } from "@/lib/format";

function Detail({ id }: { id: string }) {
  const { data: b, error, loading, reload } = useAsync(async () => (await bookingsApi.mineById(id)).data, id);
  const [confirm, confirmDialog] = useConfirm();
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [result, setResult] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const cancel = async () => {
    if (!(await confirm({ title: "Cancel this booking?", description: "Free cancellation applies up to 24 hours before pickup.", confirmLabel: "Cancel booking" }))) return;
    setCancelling(true);
    setResult(null);
    try {
      const res = await bookingsApi.cancel(id, { reason: reason.trim() || "Cancelled by customer" });
      setResult({ kind: "success", text: res.message ?? "Your booking has been cancelled." });
      reload();
    } catch (err) {
      setResult({ kind: "error", text: err instanceof Error ? err.message : "Could not cancel the booking." });
    } finally {
      setCancelling(false);
    }
  };

  const rows: [string, React.ReactNode][] = b
    ? [
        ["Pickup", `${formatDateTime(b.pickupDate, b.pickupTime)}${b.pickupLocation ? ` · ${b.pickupLocation}` : ""}`],
        ["Return", `${formatDateTime(b.returnDate, b.returnTime)}${b.returnLocation ? ` · ${b.returnLocation}` : ""}`],
        ["Payment", latestPayment(b) ? `${enumLabel(latestPayment(b)?.paymentOption)} · ${enumLabel(latestPayment(b)?.status)}` : "—"],
        ["Total", money(bookingTotal(b))],
      ]
    : [];

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/my-bookings" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All bookings
      </Link>

      {loading ? (
        <Spinner />
      ) : error || !b ? (
        <ErrorState message={error ?? "Booking not found."} onRetry={reload} />
      ) : (
        <div className="mt-4 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{b.car ? carName(b.car) : "Booking"}</h1>
              <p className="mt-1 break-all text-xs text-muted-foreground">Reference {bookingReference(b)}</p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          {result && <Notice kind={result.kind}>{result.text}</Notice>}

          <dl className="divide-y rounded-xl border bg-card text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {canCancel(b.status) && (
            <div className="space-y-3 rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold">Cancel this booking</h2>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Changed plans" />
              </div>
              <Button variant="destructive" onClick={cancel} disabled={cancelling}>
                {cancelling ? "Cancelling…" : "Cancel booking"}
              </Button>
            </div>
          )}
        </div>
      )}
      {confirmDialog}
    </section>
  );
}

export default function BookingDetail({ id }: { id: string }) {
  return (
    <RequireAuth>
      <Detail id={id} />
    </RequireAuth>
  );
}
