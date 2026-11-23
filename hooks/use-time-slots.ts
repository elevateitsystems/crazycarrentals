"use client";

import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";

function slots(from: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const mins = from + i * 15;
    return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  });
}

const FALLBACK_PICKUP_SLOTS = slots(8 * 60, 57);
const FALLBACK_RETURN_SLOTS = slots(0, 96);

export function useBookingExtras() {
  return useAsync(async () => (await bookingsApi.extras()).data, "booking-extras");
}

/** Pickup and return times are distinct API-controlled lists. */
export function useTimeSlots() {
  const { data } = useBookingExtras();
  return {
    pickupTimes: data?.pickupTimeSlots?.length ? data.pickupTimeSlots : data?.timeSlots?.length ? data.timeSlots : FALLBACK_PICKUP_SLOTS,
    returnTimes: data?.returnTimeSlots?.length ? data.returnTimeSlots : data?.timeSlots?.length ? data.timeSlots : FALLBACK_RETURN_SLOTS,
  };
}

/** Keep the API's HH:mm value for both the option value and its visible label. */
export function slotLabel(slot: string) {
  return slot;
}
