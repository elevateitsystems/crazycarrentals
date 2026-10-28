"use client";

import { BUSINESS_PHONE_HREF, BUSINESS_PHONE, BUSINESS_EMAIL } from "@/lib/business";
import CarImage from "@/components/CarImage";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Car } from "@/components/CarCard";
import type { Booking } from "@/lib/api/types";
import { bookingReference, latestPayment, type BookingData } from "@/lib/booking";
import { enumLabel, formatDateTime, money } from "@/lib/format";
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

  const pickup = formatDateTime(data.pickupDate, data.pickupTime);
  const ret = formatDateTime(data.returnDate, data.returnTime);

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
      text: `Head to ${data.pickupLocation} on ${formatDateTime(data.pickupDate, data.pickupTime)}.`,
    },
  ];

  return (
    <Card className="mx-auto max-w-4xl gap-0 rounded-3xl border-border py-0 shadow-sm">
      <CardContent className="p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-primary text-primary">
            <Check size={28} strokeWidth={2.5} />
          </span>
          <span className="mt-4 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground">
            {pending ? "Booking Reserved" : "Booking Confirmed"}
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground">
            You&apos;re all set, {data.firstName || "there"}!
          </h2>
          <p className="mt-3 max-w-md text-base leading-6 text-muted-foreground">
            Your booking has been created. Details go to{" "}
            <span className="font-semibold text-foreground">{data.email}</span>.
          </p>

          <div className="mt-7 w-full max-w-xs rounded-2xl border border-border bg-muted/60 px-6 py-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Booking Reference
            </span>
            <p className="mt-1 break-all text-2xl font-bold tracking-wide text-foreground">{reference}</p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>

          <div className="mt-5 flex gap-5">
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
              <CarImage src={car.image} alt={car.name} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-bold text-foreground">{car.name}</h4>
              <p className="text-sm text-muted-foreground">{car.category}</p>
              <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {meta.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="text-[15px] font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {Boolean(booking.summary?.length) && (
            <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-[15px] text-muted-foreground">
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
              <span className="text-base font-bold text-foreground">{payNow && !pending ? "Total paid" : "Total"}</span>
              <span className="text-2xl font-bold tracking-tight text-foreground">{money(booking.totalPrice)}</span>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground">What happens next?</h3>
          <ol className="mt-5 space-y-5">
            {next.map(({ title, text }, i) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-muted/60 px-6 py-5">
          <div>
            <p className="text-base font-semibold text-foreground">Need to change your booking?</p>
            <p className="mt-1 text-sm text-muted-foreground">Our team is available Mon–Fri 8 AM–5 PM, Sat 9 AM–3 PM, Sun 9 AM–2 PM</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href={BUSINESS_PHONE_HREF} className="flex items-center gap-1.5 hover:text-foreground">
              <Phone className="size-4 text-primary" />
              {BUSINESS_PHONE}
            </a>
            <a href={`mailto:${BUSINESS_EMAIL}`} className="flex items-center gap-1.5 hover:text-foreground">
              <Mail className="size-4 text-primary" />
              Email us
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            )}
          >
            Back to Home
          </Link>
          <Link
            href="/my-bookings"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-xl border-border bg-card px-6 text-sm font-medium text-foreground shadow-none hover:bg-muted"
            )}
          >
            My Bookings
          </Link>
          <Link
            href="/fleet"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-xl border-border bg-card px-6 text-sm font-medium text-foreground shadow-none hover:bg-muted"
            )}
          >
            Browse More Vehicles
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}