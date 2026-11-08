import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import CarImage from "@/components/CarImage";
import type { Car } from "@/components/CarCard";
import type { Estimate } from "@/lib/booking";
import { money } from "@/lib/format";
import InfoNote from "./InfoNote";

type Props = {
  car: Car;
  estimate: Estimate | null;
  estimating: boolean;
  error: string | null;
  hasDates: boolean;
  protectionName?: string;
};

export default function OrderSummary({ car, estimate, estimating, error, hasDates, protectionName }: Props) {
  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-md lg:sticky lg:top-6">
      <CardContent className="p-6">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          Order Summary
        </span>

        <div className="relative mt-3 h-44 overflow-hidden rounded-xl">
          <CarImage src={car.image} alt={car.name} />
        </div>

        <h3 className="mt-5 text-lg font-bold text-foreground">{car.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{car.category}</p>

        <dl className="mt-5 space-y-3 text-[15px]">
          {protectionName && (
            <div className="flex justify-between gap-3 text-muted-foreground">
              <dt>Protection</dt>
              <dd className="text-right font-medium text-foreground">{protectionName}</dd>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <dt>Daily rate</dt>
            <dd className="font-medium text-foreground">{money(car.price)}</dd>
          </div>
          {estimate?.lines.map((line, i) => (
            <div key={`${line.label}-${i}`} className="flex justify-between text-muted-foreground">
              <dt>{line.label}</dt>
              <dd className={line.amount < 0 ? "font-medium text-green-700" : "font-medium text-foreground"}>{money(line.amount)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-3xl font-bold tracking-tight text-foreground" aria-busy={estimating}>
            {estimating ? <Spinner className="inline size-5 text-muted-foreground" /> : estimate?.total != null ? money(estimate.total) : "—"}
          </span>
        </div>
        {estimate?.gstIncluded && <p className="mt-1 text-right text-[13px] text-muted-foreground">GST included</p>}
        {!hasDates && <p className="mt-2 text-[13px] text-muted-foreground">Choose your dates and times to see the total.</p>}
        {estimate && !estimate.available && (
          <p className="mt-2 text-[13px] font-medium text-destructive">{estimate.unavailableReason ?? "Not available for these dates."}</p>
        )}
        {error && <p className="mt-2 text-[13px] text-destructive">{error}</p>}

        <InfoNote className="mt-3.5">Free cancellation up to 24hrs before pickup</InfoNote>
      </CardContent>
    </Card>
  );
}
