"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrandLoader from "@/components/BrandLoader";
import { ErrorState } from "@/components/Feedback";
import { useAsync } from "@/hooks/use-async";
import { ApiError } from "@/lib/api/client";
import { bookingsApi, carsApi } from "@/lib/api/services";
import type { Booking } from "@/lib/api/types";
import { useAuth } from "@/lib/auth";
import { toCar } from "@/lib/cars";
import {
  initialBooking,
  LAST_STEP,
  paymentOption,
  readEstimate,
  toCreateInput,
  toTripInput,
  type BookingData,
  type Estimate,
} from "@/lib/booking";
import BookingStepper from "./BookingStepper";
import OrderSummary from "./OrderSummary";
import VehicleStep from "./VehicleStep";
import ExtrasStep from "./ExtrasStep";
import DetailsStep from "./DetailsStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";
import CardPayment from "./CardPayment";

export default function BookingFlow({ carId }: { carId: string }) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const carState = useAsync(async () => (await carsApi.get(carId)).data, carId);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(() => initialBooking(searchParams));
  const [booking, setBooking] = useState<Booking | null>(null);
  // A PAY_NOW booking the backend is holding while the customer pays by card.
  const [hold, setHold] = useState<{ booking: Booking; clientSecret: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  const update = (patch: Partial<BookingData>) => setData((prev) => ({ ...prev, ...patch }));

  // Prefill contact details once for a signed-in customer, without overwriting what they typed.
  // (State adjusted during render, which React supports for deriving state from props/context.)
  const [prefilled, setPrefilled] = useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    const [first = "", ...rest] = (user.name ?? "").split(" ");
    setData((prev) => ({
      ...prev,
      firstName: prev.firstName || first,
      lastName: prev.lastName || rest.join(" "),
      email: prev.email || user.email || "",
      phone: prev.phone || user.phoneNumber || "",
    }));
  }

  // Server-side price estimate: re-run (debounced) whenever something that affects the price changes.
  const { pickupDate, pickupTime, returnDate, returnTime, extras, airportShuttle, paymentTiming } = data;
  const canEstimate = Boolean(pickupDate && pickupTime && returnDate && returnTime);
  const estimateKey = JSON.stringify([pickupDate, pickupTime, returnDate, returnTime, extras, airportShuttle, paymentTiming]);
  useEffect(() => {
    if (!canEstimate) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setEstimating(true);
      setEstimateError(null);
      try {
        const res = await bookingsApi.estimate({ ...toTripInput(carId, data), paymentOption: paymentOption(data) });
        if (!cancelled) setEstimate(readEstimate(res.data));
      } catch (err) {
        if (!cancelled) {
          setEstimate(null);
          setEstimateError(err instanceof Error ? err.message : "Could not calculate the price.");
        }
      } finally {
        if (!cancelled) setEstimating(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `data` is intentionally summarised by estimateKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, canEstimate, estimateKey]);

  const go = (to: number) => {
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onNext = () => go(Math.min(step + 1, LAST_STEP));
  const onBack = () => go(Math.max(step - 1, 1));

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setNeedsLogin(false);
    try {
      const res = await bookingsApi.create(toCreateInput(carId, data));
      const created = res.data;
      if (paymentOption(data) === "PAY_NOW") {
        if (!created?.clientSecret) throw new Error("The server created the booking but did not start a card payment. Please contact us.");
        setHold({ booking: created, clientSecret: created.clientSecret });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setBooking(created);
        go(LAST_STEP);
      }
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) setNeedsLogin(true);
      setSubmitError(err instanceof Error ? err.message : "Could not create the booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (carState.loading) return <BrandLoader label="Loading vehicle…" className="min-h-[60vh]" />;
  if (carState.error || !carState.data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ErrorState message={carState.error ?? "Vehicle not found."} onRetry={carState.reload} />
      </div>
    );
  }
  const car = toCar(carState.data);
  const stepProps = { data, update, onNext, onBack };

  return (
    <main className="min-h-screen bg-background">
      <BookingStepper current={step} />

      <div className="mx-auto max-w-5xl px-6 py-10">
        {step === LAST_STEP && booking ? (
          <ConfirmationStep car={car} data={data} booking={booking} />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
            <div>
              {step === 1 && <VehicleStep car={car} {...stepProps} />}
              {step === 2 && <ExtrasStep {...stepProps} />}
              {step === 3 && <DetailsStep {...stepProps} />}
              {step === 4 && hold && (
                <CardPayment
                  booking={hold.booking}
                  clientSecret={hold.clientSecret}
                  data={data}
                  carId={carId}
                  onPaid={(paid) => {
                    setHold(null);
                    setBooking(paid);
                    go(LAST_STEP);
                  }}
                  onReset={() => setHold(null)}
                />
              )}
              {step === 4 && !hold && (
                <PaymentStep
                  total={estimate?.total}
                  unavailable={estimate && !estimate.available ? estimate.unavailableReason ?? "This vehicle isn't available for those dates." : null}
                  submitting={submitting}
                  error={submitError}
                  needsLogin={needsLogin}
                  {...stepProps}
                  onNext={submit}
                />
              )}
            </div>
            <OrderSummary car={car} estimate={estimate} estimating={estimating} error={estimateError} hasDates={canEstimate} />
          </div>
        )}
      </div>
    </main>
  );
}
