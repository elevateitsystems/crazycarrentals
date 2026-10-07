"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Car } from "@/components/CarCard";
import type { BookingData, Pricing } from "@/lib/booking";
import { cn } from "@/lib/utils";

type Props = { car: Car; data: BookingData; pricing: Pricing };

export default function ConfirmationStep({ car, data, pricing }: Props) {
  const [reference] = useState(() => `TAS${Math.floor(10000 + Math.random() * 90000)}`);

  const pickup = [data.pickupDate, data.pickupTime].filter(Boolean).join(" ") || "—";
  const ret = [data.returnDate, data.returnTime].filter(Boolean).join(" ") || "—";

  const meta = [
    { label: "Pickup", value: pickup },
    { label: "Return", value: ret },
    { label: "Location", value: data.pickupLocation },
    { label: "Duration", value: `${pricing.days} days` },
  ];

  const next = [
    { title: "Check your email", text: "A confirmation email with full details has been sent to your inbox." },
    { title: "Bring your licence", text: "Present your current driver's licence at pickup." },
    { title: "Security bond", text: "A security bond will be held on your card at pickup and released on return." },
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
            Booking Confirmed
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            You&apos;re all set, {data.firstName || "there"}!
          </h2>
          <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
            Your booking is confirmed. A confirmation has been sent to{" "}
            <span className="font-semibold text-foreground">your email</span>.
          </p>

          <div className="mt-6 w-full max-w-60 rounded-xl border border-border bg-muted/60 px-6 py-4">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
              Booking Reference
            </span>
            <p className="mt-1 text-xl font-bold tracking-wide text-foreground">{reference}</p>
          </div>
        </div>

        <section className="mt-7 rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground">Booking Summary</h3>

          <div className="mt-4 flex gap-4">
            <div className="relative h-14 w-19 shrink-0 overflow-hidden rounded-lg">
              <Image src={car.image} alt={car.name} fill sizes="80px" className="object-cover" />
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

          <div className="mt-4 space-y-2 border-t border-border pt-3 text-[10px] text-muted-foreground">
            <div className="flex justify-between">
              <span>
                {pricing.days} days × ${car.price}/day
              </span>
              <span className="font-medium text-foreground">${pricing.base}</span>
            </div>
            {pricing.selected.map((extra) => (
              <div key={extra.id} className="flex justify-between">
                <span>{extra.title}</span>
                <span className="font-medium text-foreground">${extra.total}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[11px] font-bold text-foreground">Total Charged</span>
            <span className="text-sm font-bold text-foreground">${pricing.total}</span>
          </div>
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