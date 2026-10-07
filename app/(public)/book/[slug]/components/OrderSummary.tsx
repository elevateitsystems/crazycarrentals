import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Car } from "@/components/CarCard";
import type { Pricing } from "@/lib/booking";
import InfoNote from "./InfoNote";

export default function OrderSummary({ car, pricing }: { car: Car; pricing: Pricing }) {
  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-sm lg:sticky lg:top-6">
      <CardContent className="p-5">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
          Order Summary
        </span>

        <div className="relative mt-3 h-34 overflow-hidden rounded-xl">
          <Image src={car.image} alt={car.name} fill sizes="320px" className="object-cover" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-foreground">{car.name}</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{car.category}</p>

        <dl className="mt-4 space-y-2 text-[11px]">
          <div className="flex justify-between text-muted-foreground">
            <dt>
              {pricing.days} days × ${car.price}
            </dt>
            <dd className="font-medium text-foreground">${pricing.base}</dd>
          </div>
          {pricing.selected.map((extra) => (
            <div key={extra.id} className="flex justify-between text-muted-foreground">
              <dt>{extra.title}</dt>
              <dd className="font-medium text-foreground">${extra.total}</dd>
            </div>
          ))}
          <div className="flex justify-between text-muted-foreground">
            <dt>GST included</dt>
            <dd>—</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">${pricing.total}</span>
        </div>

        <InfoNote className="mt-3.5">Free cancellation up to 24hrs before pickup</InfoNote>
      </CardContent>
    </Card>
  );
}