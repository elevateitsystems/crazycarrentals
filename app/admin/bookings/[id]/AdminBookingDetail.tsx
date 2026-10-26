"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ErrorState, Notice, Refreshing, Spinner } from "@/components/Feedback";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { useAsync } from "@/hooks/use-async";
import { adminApi } from "@/lib/api/services";
import type { Payment } from "@/lib/api/types";
import { adminActions, bookingCustomer, bookingReference, bookingTotal, latestPayment } from "@/lib/booking";
import { carName, enumLabel, formatDate, formatDateTime, formatTimestamp, money } from "@/lib/format";

type Action = "confirm" | "collect" | "complete" | "cancel";

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 py-2.5">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function cardLabel(p: Payment) {
  if (p.cardBrand || p.cardLast4) return `${enumLabel(p.cardBrand ?? "Card")} •••• ${p.cardLast4 ?? "????"}`;
  return p.paymentMethod ?? "—";
}

export default function AdminBookingDetail({ id }: { id: string }) {
  const { data: b, error, loading, refreshing, reload } = useAsync(async () => (await adminApi.booking(id)).data, id);
  const [confirm, confirmDialog] = useConfirm();
  const [guard, working] = useBusy();
  const [busy, setBusy] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const perform = async (action: Action) => {
    if (action === "cancel" && !(await confirm({ title: "Cancel this booking?", description: "A card payment already taken is refunded by the system.", confirmLabel: "Cancel booking" }))) return;
    if (action === "complete" && !(await confirm({ title: "Mark booking as completed?", description: "Use this once the vehicle has been returned.", confirmLabel: "Complete", destructive: false }))) return;
    if (action === "collect" && !(await confirm({ title: `Record desk payment of ${money(b ? bookingTotal(b) : undefined)}?`, description: "Only do this once the customer has paid at the counter.", confirmLabel: "Record payment", destructive: false }))) return;
    setBusy(action);
    setFlash(null);
    try {
      const res =
        action === "confirm" ? await adminApi.confirmBooking(id)
        : action === "collect" ? await adminApi.collectPayment(id)
        : action === "complete" ? await adminApi.completeBooking(id)
        : await adminApi.cancelBooking(id, reason.trim() || "Cancelled by admin");
      setFlash({ kind: "success", text: res.message ?? "Done." });
      setReason("");
      reload();
    } catch (err) {
      setFlash({ kind: "error", text: err instanceof Error ? err.message : "The action failed." });
    } finally {
      setBusy(null);
    }
  };

  // One action at a time, even if a button is clicked twice before React re-renders it as disabled.
  const run = (action: Action) => void guard(() => perform(action));

  if (loading && !refreshing) return <Spinner />;
  if (error || !b) {
    return (
      <div className="space-y-4">
        <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All bookings
        </Link>
        <ErrorState message={error ?? "Booking not found."} onRetry={reload} />
      </div>
    );
  }

  const payment = latestPayment(b);
  const person = b.bookingPersonDetails?.[0];
  const actions = adminActions(b);
  const disabled = working;
  const shuttle = b.airportShuttles?.find((s) => s.shuttleService);

  return (
    <Refreshing active={refreshing} className="space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All bookings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking {bookingReference(b)}</h1>
          <p className="mt-1 text-xs text-muted-foreground">Created {formatTimestamp(b.createdAt)} · ID {b.id}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={b.status} />
          <StatusBadge status={payment?.status} />
        </div>
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}
      {b.status === "PENDING" && b.holdExpiresAt && (
        <Notice kind="info">Waiting for the customer&apos;s card payment. The vehicle is held until {formatTimestamp(b.holdExpiresAt)}.</Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Renter</CardTitle></CardHeader>
          <CardContent>
            <Rows
              rows={[
                ["Name", bookingCustomer(b) || "—"],
                ["Email", person?.email ?? "—"],
                ["Phone", person?.phoneNumber ?? "—"],
                ["Account", b.user ? `${b.user.name ?? "—"} (${b.user.email ?? "—"})` : "Guest"],
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Trip</CardTitle></CardHeader>
          <CardContent>
            <Rows
              rows={[
                ["Vehicle", b.car ? `${carName(b.car)}${b.car.plate ? ` · ${b.car.plate}` : ""}` : "—"],
                ["Pickup", `${formatDateTime(b.pickupDate, b.pickupTime)}${b.pickupLocation ? ` · ${b.pickupLocation}` : ""}`],
                ["Return", `${formatDateTime(b.returnDate, b.returnTime)}${b.returnLocation ? ` · ${b.returnLocation}` : ""}`],
                ["Rental days", b.rentalDays ?? "—"],
                ["Extras", b.extraServices?.length ? b.extraServices.map((e) => e.name).join(", ") : "None"],
                ["Airport shuttle", shuttle ? money(shuttle.price) : "No"],
                ["Driver licence", b.driverInfo ? `${b.driverInfo.licenseState ?? ""} ${b.driverInfo.licenseNumber ?? ""} · exp. ${formatDate(b.driverInfo.licenseExpiry)}` : "—"],
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Price</CardTitle></CardHeader>
        <CardContent>
          <Rows
            rows={[
              ...(b.summary ?? []).map((l): [string, React.ReactNode] => [l.label, money(l.amount)]),
              ["Total", <span key="t" className="text-base">{money(bookingTotal(b))}</span>],
            ]}
          />
          {b.gstIncluded && <p className="mt-2 text-xs text-muted-foreground">GST included.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment history</CardTitle></CardHeader>
        <CardContent className="px-0">
          {!b.payments?.length ? (
            <p className="px-6 text-sm text-muted-foreground">No payment records.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Option</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Transaction</th>
                    <th className="px-6 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {b.payments.map((p, i) => (
                    <tr key={p.id ?? i}>
                      <td className="px-6 py-3">{enumLabel(p.paymentOption)}</td>
                      <td className="px-6 py-3">{cardLabel(p)}</td>
                      <td className="px-6 py-3 font-medium">{money(p.amount)}</td>
                      <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-3 break-all font-mono text-xs text-muted-foreground">{p.transactionId ?? p.stripePaymentIntentId ?? "—"}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-muted-foreground">{formatTimestamp(p.updatedAt ?? p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payment?.billingStreet && (
                <p className="px-6 pt-3 text-xs text-muted-foreground">
                  Billing address: {[payment.billingStreet, payment.billingSuburb, payment.billingState, payment.billingPostcode].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold">Actions</h2>
        {!actions.confirm && !actions.collect && !actions.complete && !actions.cancel ? (
          <p className="text-sm text-muted-foreground">No actions are available for a {enumLabel(b.status).toLowerCase()} booking.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {actions.confirm && (
                <Button onClick={() => run("confirm")} disabled={disabled} loading={busy === "confirm"} title="Confirms the hold only if Stripe reports the card payment succeeded">
                  {busy === "confirm" ? "Checking with Stripe…" : "Confirm Pay Now hold"}
                </Button>
              )}
              {actions.collect && (
                <Button onClick={() => run("collect")} disabled={disabled} loading={busy === "collect"}>{busy === "collect" ? "Recording…" : "Collect desk payment"}</Button>
              )}
              {actions.complete && (
                <Button variant="outline" onClick={() => run("complete")} disabled={disabled} loading={busy === "complete"}>{busy === "complete" ? "Completing…" : "Complete booking"}</Button>
              )}
            </div>
            {actions.confirm && (
              <p className="text-xs text-muted-foreground">Use this if the customer paid but closed the page before the booking was confirmed.</p>
            )}

            {actions.cancel && (
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="reason">Cancellation reason</Label>
                <div className="flex flex-wrap gap-2">
                  <Input id="reason" className="min-w-56 flex-1" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Customer called to cancel" />
                  <Button variant="destructive" onClick={() => run("cancel")} disabled={disabled} loading={busy === "cancel"}>{busy === "cancel" ? "Cancelling…" : "Cancel booking"}</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {confirmDialog}
    </Refreshing>
  );
}
