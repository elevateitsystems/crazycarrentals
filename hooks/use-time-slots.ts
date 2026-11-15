"use client";

import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";

/** Used only until (or if) `GET /bookings/extras` answers: 08:00 to 20:00 in 15-minute steps. */
const FALLBACK_SLOTS = Array.from({ length: 49 }, (_, i) => {
  const mins = 8 * 60 + i * 15;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

/** Pickup/return times from the API's `timeSlots`, in the order given. */
export function useTimeSlots(): string[] {
  const { data } = useAsync(async () => (await bookingsApi.extras()).data, "time-slots");
  return data?.timeSlots?.length ? data.timeSlots : FALLBACK_SLOTS;
}

/** "13:15" → "1:15 pm" for display; the raw value is what gets sent. */
export function slotLabel(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return slot;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
