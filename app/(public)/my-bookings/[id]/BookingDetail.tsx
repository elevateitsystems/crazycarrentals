"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import CarImage from "@/components/CarImage";
import { ErrorState, Notice, Refreshing, Spinner } from "@/components/Feedback";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";
import { bookingReference, bookingTotal, canCancel, latestPayment } from "@/lib/booking";
import { FALLBACK_CAR_IMAGE } from "@/lib/cars";
import { carImage, carName, enumLabel, formatDateTime, formatTimestamp, money } from "@/lib/format";
import { cn } from "@/lib/utils";

function Detail({ id }: { id: string }) {
  const { data: b, error, loading, refreshing, reload } = useAsync(async () => (await bookingsApi.mineById(id)).data, id);
  const [confirm, confirmDialog] = useConfirm();
  const [reason, setReason] = useState("");
  const [guard, working] = useBusy();
  const [cancelling, setCancelling] = useState(false); // only while the request is in flight, not while confirming
  const [result, setResult] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const cancel = () =>
    guard(async () => {
      if (!(await confirm({ title: "Cancel this booking?", description: "Free cancellation applies up to 24 hours before pickup.", confirmLabel: "Cancel booking" }))) return;
      setResult(null);
      setCancelling(true);
      try {
        const res = await bookingsApi.cancel(id, { reason: reason.trim() || "Cancelled by customer" });
        setResult({ kind: "success", text: res.message ?? "Your booking has been cancelled." });
        reload();
      } catch (err) {
        setResult({ kind: "error", text: err instanceof Error ? err.message : "Could not cancel the booking." });
      } finally {
        setCancelling(false);
      }
    });

  const payment = b ? latestPayment(b) : undefined;
  const card = payment?.cardLast4 ? `${enumLabel(payment.cardBrand ?? "Card")} •••• ${payment.cardLast4}` : payment?.paymentMethod;
  const extras = b?.extraServices?.map((e) => e.name).filter(Boolean) ?? [];
  const shuttle = b?.airportShuttles?.some((x) => x.shuttleService);
  const specs = b?.car
    ? [
        b.car.carType && enumLabel(b.car.carType),
        b.car.transmission && enumLabel(b.car.transmission),
        b.car.fuelType && enumLabel(b.car.fuelType),
        b.car.totalSeat ? `${b.car.totalSeat} seats` : "",
      ].filter(Boolean)
    : [];

  return (
    <div className="bg-muted/40">
      <section className="mx-auto min-h-[60vh] max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/my-bookings" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> All bookings
        </Link>

        {loading && !refreshing ? (
          <Spinner label="Loading your booking…" />
        ) : error || !b ? (
          <ErrorState message={error ?? "Booking not found."} onRetry={reload} />
        ) : (
          <Refreshing active={refreshing} className="mt-5">
            <div className="space-y-6">
            {/* Header card */}
            <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-[18rem_1fr]">
              <div className="relative h-52 bg-muted md:h-full md:min-h-48">
                <CarImage src={carImage(b.car) ?? FALLBACK_CAR_IMAGE} alt={b.car ? carName(b.car) : "Vehicle"} />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6">
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge status={b.status} />
                  <StatusBadge status={payment?.status} prefix="Payment:" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{b.car ? carName(b.car) : "Booking"}</h1>
                  {b.car?.year && <p className="text-sm text-muted-foreground">{b.car.year}{b.car.color ? ` · ${b.car.color}` : ""}</p>}
                </div>
                {specs.length > 0 && <p className="text-sm text-muted-foreground">{specs.join("  ·  ")}</p>}
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference <span className="ml-1 select-all text-sm normal-case tracking-normal text-foreground">{bookingReference(b)}</span>
                </p>
              </div>
            </div>

            {result && <Notice kind={result.kind}>{result.text}</Notice>}
            {b.status === "PENDING" && b.holdExpiresAt && (
              <Notice kind="info">
                This booking is waiting for payment. The vehicle is held until {formatTimestamp(b.holdExpiresAt)}.
              </Notice>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-6">
                {/* Trip */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-base font-semibold">Your trip</h2>
                  <ol className="mt-5 space-y-6 border-l-2 border-primary/30 pl-6">
                    {[
                      { label: "Pickup", date: b.pickupDate, time: b.pickupTime, place: b.pickupLocation },
                      { label: "Return", date: b.returnDate, time: b.returnTime, place: b.returnLocation },
                    ].map((t) => (
                      <li key={t.label} className="relative">
                        <span aria-hidden className="absolute -left-[33px] top-1 size-3.5 rounded-full border-2 border-primary bg-card" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.label}</p>
                        <p className="mt-0.5 text-lg font-semibold">{formatDateTime(t.date, t.time)}</p>
                        {t.place && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" aria-hidden /> {t.place}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                  {(extras.length > 0 || shuttle) && (
                    <div className="mt-6 border-t border-border pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Extras</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[...extras, ...(shuttle ? ["Airport shuttle"] : [])].map((x) => (
                          <span key={x} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{x}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {canCancel(b.status) && (
                  <div className="space-y-3 rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
                    <h2 className="text-base font-semibold">Need to cancel?</h2>
                    <p className="text-sm text-muted-foreground">Free cancellation applies up to 24 hours before pickup.</p>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (optional)</Label>
                      <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Changed plans" className="h-11 rounded-xl" />
                    </div>
                    <Button variant="destructive" onClick={cancel} disabled={working} loading={cancelling} className="h-10 rounded-xl px-5">
                      {cancelling ? "Cancelling…" : "Cancel booking"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Price + payment */}
              <aside className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-base font-semibold">Price summary</h2>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    {(b.summary ?? []).map((l, i) => (
                      <div key={`${l.label}-${i}`} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{l.label}</dt>
                        <dd className={cn("font-medium", l.amount < 0 && "text-green-700")}>{money(l.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold tracking-tight">{money(bookingTotal(b))}</span>
                  </div>
                  {b.gstIncluded && <p className="mt-1 text-right text-xs text-muted-foreground">GST included</p>}
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-base font-semibold"><CreditCard className="size-4 text-primary" aria-hidden /> Payment</h2>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    {[
                      ["Option", enumLabel(payment?.paymentOption) || "—"],
                      ["Method", card || "—"],
                      ["Status", enumLabel(payment?.status) || "—"],
                      ["Amount", money(payment?.amount ?? b.totalPrice)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </aside>
            </div>
            </div>
          </Refreshing>
        )}
        {confirmDialog}
      </section>
    </div>
  );
}

export default function BookingDetail({ id }: { id: string }) {
  return (
    <RequireAuth>
      <Detail id={id} />
    </RequireAuth>
  );
}
