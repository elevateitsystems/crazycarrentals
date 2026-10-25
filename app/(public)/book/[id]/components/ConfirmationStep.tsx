"use client";

import CarImage from "@/components/CarImage";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Car } from "@/components/CarCard";
import type { Booking } from "@/lib/api/types";
import { bookingReference, latestPayment, type BookingData } from "@/lib/booking";
import { enumLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { car: Car; data: BookingData; booking: Booking };

export default function ConfirmationStep({ car, data, booking }: Props) {
  const reference = bookingReference(booking);
  const status = booking.status;
  const payment = latestPayment(booking);
  const paymentStatus = payment?.status;
  const payNow = data.paymentTiming === "payNow";
  const pending = payNow && paymentStatus !== "COMPLETED";
  const card = payment?.cardLast4 ? `${enumLabel(payment.cardBrand ?? "Card")} •••• ${payment.cardLast4}` : null;

  const pickup = [data.pickupDate, data.pickupTime].filter(Boolean).join(" ") || "—";
  const ret = [data.returnDate, data.returnTime].filter(Boolean).join(" ") || "—";

  const meta = [
    { label: "Pickup", value: pickup },
    { label: "Return", value: ret },
    { label: "Location", value: data.pickupLocation },
    ...(status ? [{ label: "Status", value: enumLabel(status) }] : []),
    ...(paymentStatus ? [{ label: "Payment", value: enumLabel(paymentStatus) }] : []),
    ...(card ? [{ label: "Card", value: card }] : []),
  ];

  const next = [
    { title: "Check your email", text: `Booking details are sent to ${data.email}.` },
    { title: "Bring your licence", text: "Present your current driver's licence at pickup." },
    payNow
      ? { title: pending ? "Payment pending" : "Payment received", text: pending ? "Your booking is reserved but payment has not been confirmed yet. Our team will confirm it with you." : `Your payment of ${money(payment?.amount ?? booking.totalPrice)} has been received.` }
      : { title: "Pay at the desk", text: "Payment is collected by our team when you pick up the vehicle." },
    {
      title: "Pick up your car",
      text: `Head to ${data.pickupLocation} on ${data.pickupDate || "—"} at ${data.pickupTime || "—"}.`,
    },
  ];

  return (
    <Card className="mx-auto max-w-3xl gap-0 rounded-2xl border-border py-0 shadow-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full border-2 border-primary text-primary">
            <Check size={24} strokeWidth={2.5} />
          </span>
          <span className="mt-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-medium text-primary">
            {pending ? "Booking Reserved" : "Booking Confirmed"}
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            You&apos;re all set, {data.firstName || "there"}!
          </h2>
          <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
            Your booking has been created. Details go to{" "}
            <span className="font-semibold text-foreground">{data.email}</span>.
          </p>

          <div className="mt-6 w-full max-w-60 rounded-xl border border-border bg-muted/60 px-6 py-4">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
              Booking Reference
            </span>
            <p className="mt-1 break-all text-xl font-bold tracking-wide text-foreground">{reference}</p>
          </div>
        </div>

        <section className="mt-7 rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground">Booking Summary</h3>

          <div className="mt-4 flex gap-4">
            <div className="relative h-14 w-19 shrink-0 overflow-hidden rounded-lg">
              <CarImage src={car.image} alt={car.name} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground">{car.name}</h4>
              <p className="text-[9px] text-muted-foreground">{car.category}</p>
              <dl className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
                {meta.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="text-[10px] font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {Boolean(booking.summary?.length) && (
            <div className="mt-4 space-y-2 border-t border-border pt-3 text-[10px] text-muted-foreground">
              {booking.summary?.map((line, i) => (
                <div key={`${line.label}-${i}`} className="flex justify-between">
                  <span>{line.label}</span>
                  <span className="font-medium text-foreground">{money(line.amount)}</span>
                </div>
              ))}
            </div>
          )}
          {booking.totalPrice != null && (
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] font-bold text-foreground">{payNow && !pending ? "Total paid" : "Total"}</span>
              <span className="text-sm font-bold text-foreground">{money(booking.totalPrice)}</span>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground">What happens next?</h3>
          <ol className="mt-4 space-y-3.5">
            {next.map(({ title, text }, i) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[9px] font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 px-5 py-3.5">
          <div>
            <p className="text-[11px] font-semibold text-foreground">Need to change your booking?</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Our team is available Mon–Fri 8am–6pm</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <a href="tel:0362000000" className="flex items-center gap-1.5 hover:text-foreground">
              <Phone className="size-3.5 text-primary" />
              (03) 6200 0000
            </a>
            <a href="mailto:hello@tasdrive.com.au" className="flex items-center gap-1.5 hover:text-foreground">
              <Mail className="size-3.5 text-primary" />
              Email us
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2.5">
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "h-9 rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            )}
          >
            Back to Home
          </Link>
          <Link
            href="/my-bookings"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 rounded-lg border-border bg-card px-5 text-xs font-medium text-foreground shadow-none hover:bg-muted"
            )}
          >
            My Bookings
          </Link>
          <Link
            href="/fleet"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 rounded-lg border-border bg-card px-5 text-xs font-medium text-foreground shadow-none hover:bg-muted"
            )}
          >
            Browse More Vehicles
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}