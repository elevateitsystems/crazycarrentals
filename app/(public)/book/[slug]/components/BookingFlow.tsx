"use client";

import { useState } from "react";
import type { Car } from "@/components/CarCard";
import { getPricing, initialBooking, type BookingData } from "@/lib/booking";
import BookingStepper from "./BookingStepper";
import OrderSummary from "./OrderSummary";
import VehicleStep from "./VehicleStep";
import ExtrasStep from "./ExtrasStep";
import DetailsStep from "./DetailsStep";
import DriverStep from "./DriverStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";

export default function BookingFlow({ car }: { car: Car }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialBooking);

  const update = (patch: Partial<BookingData>) => setData((prev) => ({ ...prev, ...patch }));
  const go = (to: number) => {
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onNext = () => go(Math.min(step + 1, 6));
  const onBack = () => go(Math.max(step - 1, 1));

  const pricing = getPricing(car, data);
  const stepProps = { data, update, onNext, onBack };

  return (
    <main className="min-h-screen bg-background">
      <BookingStepper current={step} />

      <div className="mx-auto max-w-5xl px-6 py-10">
        {step === 6 ? (
          <ConfirmationStep car={car} data={data} pricing={pricing} />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
            <div>
              {step === 1 && <VehicleStep car={car} {...stepProps} />}
              {step === 2 && <ExtrasStep days={pricing.days} {...stepProps} />}
              {step === 3 && <DetailsStep {...stepProps} />}
              {step === 4 && <DriverStep {...stepProps} />}
              {step === 5 && <PaymentStep total={pricing.total} {...stepProps} />}
            </div>
            <OrderSummary car={car} pricing={pricing} />
          </div>
        )}
      </div>
    </main>
  );
}