import CarImage from "@/components/CarImage";
import Link from "next/link";
import type { Car } from "@/components/CarCard";
import type { StepProps } from "@/lib/booking";
import FormField from "./FormField";
import StepCard from "./StepCard";

export default function VehicleStep({ car, data, update, onNext }: StepProps & { car: Car }) {
  const specs = [
    { label: "Seats", value: car.seats },
    { label: "Trans.", value: car.transmission === "Automatic" ? "Auto" : car.transmission },
    { label: "Fuel", value: car.fuel },
    { label: "Doors", value: car.doors },
  ];

  return (
    <StepCard
      title="Confirm your vehicle"
      description="Review your selected vehicle and set your rental dates."
      backHref="/fleet"
      backLabel="Back to Fleet"
      onSubmit={onNext}
    >
      <div className="grid overflow-hidden rounded-2xl border-2 border-primary bg-card sm:grid-cols-[1fr_1.6fr]">
        <div className="relative h-52 sm:h-auto sm:min-h-56">
          <CarImage src={car.image} alt={car.name} />
        </div>
        <div className="p-6">
          <span className="inline-block rounded bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Selected vehicle
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{car.name}</h3>

          <dl className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
            {specs.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-sm text-muted-foreground">
            From <span className="text-4xl font-bold tracking-tight text-foreground">${car.price}</span>/day
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-6">
        <h3 className="text-lg font-semibold text-foreground">Rental details</h3>

        <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormField
            id="pickupLocation"
            label="Pickup location"
            required
            wrapperClassName="sm:col-span-2"
            value={data.pickupLocation}
            onChange={(e) => update({ pickupLocation: e.target.value })}
          />
          <FormField
            id="returnLocation"
            label="Return location"
            wrapperClassName="sm:col-span-2"
            placeholder="Same as pickup"
            value={data.returnLocation}
            onChange={(e) => update({ returnLocation: e.target.value })}
          />
          <FormField
            id="pickupDate"
            label="Pickup date"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={data.pickupDate}
            onChange={(e) => update({ pickupDate: e.target.value })}
          />
          <FormField
            id="pickupTime"
            label="Pickup time"
            type="time"
            required
            value={data.pickupTime}
            onChange={(e) => update({ pickupTime: e.target.value })}
          />
          <FormField
            id="returnDate"
            label="Return date"
            type="date"
            required
            min={data.pickupDate}
            value={data.returnDate}
            onChange={(e) => update({ returnDate: e.target.value })}
          />
          <FormField
            id="returnTime"
            label="Return time"
            type="time"
            required
            value={data.returnTime}
            onChange={(e) => update({ returnTime: e.target.value })}
          />
        </div>
      </div>

      <Link
        href="/fleet"
        className="mt-5 inline-block text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        ← Change vehicle
      </Link>
    </StepCard>
  );
}