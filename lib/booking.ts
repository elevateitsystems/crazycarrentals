import { RENTAL_LOCATION_LABEL } from "@/lib/locations";
import { STANDARD_TIER } from "@/lib/protection";
import type { Booking, CreateBookingInput, DailyRate, Estimate as ApiEstimate, Payment, PaymentOption, PriceLine, TripInput } from "@/lib/api/types";

export const steps = ["Vehicle", "Protection & Extras", "Your Details", "Payment", "Confirmation"] as const;
export const LAST_STEP = steps.length;

export type BookingData = {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  extras: string[];
  /** Chosen protection package: "standard" (included) or a backend protection id, which is also sent in `extras`. */
  protection: string;
  protectionName: string;
  airportShuttle: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentTiming: "payNow" | "payDesk";
  paymentMethod: "Credit Card" | "Debit Card";
  street: string;
  suburb: string;
  state: string;
  postcode: string;
};

export function initialBooking(prefill: URLSearchParams | null): BookingData {
  const get = (k: string) => prefill?.get(k) ?? "";
  return {
    pickupLocation: get("pickupLocation") || RENTAL_LOCATION_LABEL,
    returnLocation: get("returnLocation"),
    pickupDate: get("pickupDate"),
    pickupTime: get("pickupTime"),
    returnDate: get("returnDate"),
    returnTime: get("returnTime"),
    extras: [],
    protection: STANDARD_TIER.id,
    protectionName: STANDARD_TIER.name,
    airportShuttle: get("airportShuttle") === "1",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentTiming: "payNow",
    paymentMethod: "Credit Card",
    street: "",
    suburb: "",
    state: "",
    postcode: "",
  };
}

export type StepProps = {
  data: BookingData;
  update: (patch: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export const paymentOption = (d: BookingData): PaymentOption => (d.paymentTiming === "payNow" ? "PAY_NOW" : "PAY_AT_DESK");

export function toTripInput(carId: string, d: BookingData): TripInput {
  return {
    carId,
    pickupDate: d.pickupDate,
    pickupTime: d.pickupTime,
    returnDate: d.returnDate,
    returnTime: d.returnTime,
    extraServiceIds: d.extras,
    airportShuttle: d.airportShuttle,
  };
}

export function toCreateInput(carId: string, d: BookingData): CreateBookingInput {
  const payNow = d.paymentTiming === "payNow";
  return {
    ...toTripInput(carId, d),
    pickupLocation: d.pickupLocation,
    returnLocation: d.returnLocation || d.pickupLocation,
    bookingPersonDetails: { firstName: d.firstName, lastName: d.lastName, email: d.email, phoneNumber: d.phone },
    payment: payNow
      ? {
          paymentOption: "PAY_NOW",
          paymentMethod: d.paymentMethod,
          billingAddress: { street: d.street, suburb: d.suburb, state: d.state, postcode: d.postcode },
        }
      : { paymentOption: "PAY_AT_DESK" },
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Price breakdown as the order summary renders it. Lines come straight from the backend's `pricing.summary`. */
export type Estimate = {
  lines: PriceLine[];
  total?: number;
  /** Amount taken off by the Pay Now discount (0 for Pay at Desk). */
  discount?: number;
  discountPercentage?: number;
  /** Both totals come back whichever option was estimated. */
  payNowTotal?: number;
  payAtDeskTotal?: number;
  rentalDays?: number;
  /** Vehicle charge for the stay. The Pay Now discount is a percentage of this amount only. */
  vehicleTotal?: number;
  /** The rate charged for each night: it differs between dates when calendar date prices are set. */
  dailyRates: DailyRate[];
  gstIncluded?: boolean;
  available: boolean;
  unavailableReason?: string | null;
};

export function readEstimate(raw: ApiEstimate | null | undefined): Estimate {
  const pricing = raw?.pricing;
  return {
    lines: (pricing?.summary ?? []).filter((l) => typeof l?.amount === "number"),
    total: pricing?.totalPrice,
    discount: pricing?.discount,
    discountPercentage: pricing?.discountPercentage,
    payNowTotal: pricing?.payNowTotal,
    payAtDeskTotal: pricing?.payAtDeskTotal,
    rentalDays: pricing?.rentalDays ?? raw?.rentalDetails?.rentalDays,
    vehicleTotal: pricing?.baseCarPrice,
    dailyRates: (pricing?.dailyRates ?? []).filter((d) => d && typeof d.date === "string" && typeof d.price === "number"),
    gstIncluded: pricing?.gstIncluded,
    available: raw?.isAvailable !== false,
    unavailableReason: raw?.unavailableReason,
  };
}

export function findString(raw: unknown, keys: string[]): string | undefined {
  const queue: unknown[] = [raw];
  while (queue.length) {
    const node = queue.shift();
    if (!isRecord(node)) continue;
    for (const k of keys) if (typeof node[k] === "string" && node[k]) return node[k] as string;
    queue.push(...Object.values(node).filter(isRecord));
  }
  return undefined;
}

export function bookingTotal(b: Booking): number | undefined {
  return b.totalPrice;
}

/** List rows carry `payment`; detail responses carry the full `payments` history (latest last). */
export function latestPayment(b: Booking): Payment | undefined {
  return b.payment ?? b.payments?.[b.payments.length - 1];
}

export function bookingReference(b: Booking): string {
  return b.bookingReference ?? b.id;
}

/** Cancel is offered unless the booking is already finished or cancelled; the backend has the final say. */
export function canCancel(status: unknown) {
  return typeof status === "string" && !/(cancel|complete)/i.test(status);
}

/** Renter name: list rows have `customer`, detail has `bookingPersonDetails[]`, with the account user as a fallback. */
export function bookingCustomer(b: Booking): string {
  const person = b.bookingPersonDetails?.[0];
  const fromPerson = person ? [person.firstName, person.lastName].filter(Boolean).join(" ") : "";
  return b.customer?.name || fromPerson || b.user?.name || b.customer?.email || person?.email || "";
}

export function bookingEmail(b: Booking): string | undefined {
  return b.customer?.email ?? b.bookingPersonDetails?.[0]?.email ?? b.user?.email;
}

/**
 * Which admin actions make sense for a booking, mirroring the backend's rules (verified against the API):
 * confirm needs a PAY_NOW hold still PENDING; collect needs PAY_AT_DESK with payment PENDING_AT_DESK;
 * complete needs an active (CONFIRMED) booking; cancel anything not yet cancelled or completed.
 */
export function adminActions(b: Booking) {
  const payment = latestPayment(b);
  const status = b.status ?? "";
  const open = canCancel(status);
  return {
    confirm: status === "PENDING" && payment?.paymentOption === "PAY_NOW",
    collect: open && payment?.paymentOption === "PAY_AT_DESK" && payment?.status === "PENDING_AT_DESK",
    complete: status === "CONFIRMED",
    cancel: open,
  };
}
