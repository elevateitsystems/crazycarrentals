import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import CarImage from "@/components/CarImage";
import type { Car } from "@/components/CarCard";
import type { Estimate } from "@/lib/booking";
import { money } from "@/lib/format";
import InfoNote from "./InfoNote";

type Props = { car: Car; estimate: Estimate | null; estimating: boolean; error: string | null; hasDates: boolean };

export default function OrderSummary({ car, estimate, estimating, error, hasDates }: Props) {
  return (
    <Card className="gap-0 rounded-2xl border-border py-0 shadow-sm lg:sticky lg:top-6">
      <CardContent className="p-5">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
          Order Summary
        </span>

        <div className="relative mt-3 h-34 overflow-hidden rounded-xl">
          <CarImage src={car.image} alt={car.name} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-foreground">{car.name}</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{car.category}</p>

        <dl className="mt-4 space-y-2 text-[11px]">
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

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground" aria-busy={estimating}>
            {estimating ? <Spinner className="inline size-5 text-muted-foreground" /> : estimate?.total != null ? money(estimate.total) : "—"}
          </span>
        </div>
        {estimate?.gstIncluded && <p className="mt-1 text-right text-[10px] text-muted-foreground">GST included</p>}
        {!hasDates && <p className="mt-2 text-[10px] text-muted-foreground">Choose your dates and times to see the total.</p>}
        {estimate && !estimate.available && (
          <p className="mt-2 text-[10px] font-medium text-destructive">{estimate.unavailableReason ?? "Not available for these dates."}</p>
        )}
        {error && <p className="mt-2 text-[10px] text-destructive">{error}</p>}

        <InfoNote className="mt-3.5">Free cancellation up to 24hrs before pickup</InfoNote>
      </CardContent>
    </Card>
  );
}
