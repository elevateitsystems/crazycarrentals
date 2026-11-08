// Request fields come from the Insomnia collection; response fields were checked against the live backend.
// Fields the backend may omit stay optional.

export type PageMeta = { page: number; limit: number; total: number; totalPages: number };

export type ApiResult<T> = { data: T; meta?: PageMeta; message?: string; raw: unknown };

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type User = {
  id: string;
  name?: string;
  email?: string;
  role?: Role | string;
  phoneNumber?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  isEmailVerified?: boolean;
  lastLoginAt?: string | null;
  loginAttempts?: number;
  lockedUntil?: string | null;
  createdAt?: string;
  _count?: { bookings?: number; reviews?: number };
  [key: string]: unknown;
};

export type Driver = {
  id: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  /** Sent as "25" or "25+", returned as a number. */
  age?: number | string;
  licenseState?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  cars?: { id: string; brand?: string; model?: string; year?: number; plate?: string }[];
  bookingsCount?: number;
  [key: string]: unknown;
};

/** The licence snapshot embedded in cars and bookings (no name). */
export type DriverInfo = {
  /** Not returned by the public car API today; shown on the car page as soon as the backend includes it. */
  name?: string;
  dateOfBirth?: string;
  age?: string;
  licenseState?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
};

export type Car = {
  id: string;
  brand?: string;
  model?: string;
  year?: number | string;
  color?: string;
  plate?: string;
  pricePerDay?: number | string;
  totalSeat?: number;
  doors?: number;
  mileage?: number | string;
  fuelType?: string;
  transmission?: string;
  carType?: string;
  description?: string;
  features?: string[] | string;
  safetyRatings?: string[] | string;
  images?: (string | { url?: string })[];
  /** Booking lists carry a single thumbnail instead of `images`. */
  image?: string;
  isAvailable?: boolean;
  driverInfoId?: string | null;
  driverInfo?: DriverInfo | null;
  bookedDates?: unknown[];
  [key: string]: unknown;
};

export type ExtraService = {
  id: string;
  name?: string;
  description?: string;
  pricePerDay?: number;
  /** Admin list only. Inactive extras are hidden from customers' booking step. */
  isActive?: boolean;
  /** Admin list only: how many bookings used this extra. */
  bookingsCount?: number;
  updatedAt?: string;
  [key: string]: unknown;
};

/** A protection package (Admin → Protection management). Its id is also an extra id: book it by sending the id in `extraServiceIds`. */
export type Protection = {
  id: string;
  name: string;
  pricePerDay: number;
  isPopular?: boolean;
  included?: string[];
  excluded?: string[];
  excessLabel?: string;
  excessOver25?: string;
  excessUnder25?: string;
  bondCredit?: number;
  bondDebit?: number;
  updatedAt?: string;
};

/** Fields sent when creating or updating a protection. */
export type ProtectionInput = Omit<Protection, "id" | "updatedAt">;

export type ExtrasCatalog = {
  extras: ExtraService[];
  protections?: Protection[];
  airportShuttle?: { name?: string; price?: number; type?: string; description?: string };
  discounts?: { payNowDiscountPercent?: number; description?: string };
};

export type PaymentOption = "PAY_NOW" | "PAY_AT_DESK";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PENDING_AT_DESK" | "COMPLETED" | "REFUNDED";

export type Payment = {
  id?: string;
  paymentOption?: PaymentOption | string;
  paymentMethod?: string | null;
  status?: PaymentStatus | string;
  amount?: number;
  transactionId?: string | null;
  stripePaymentIntentId?: string | null;
  cardLast4?: string | null;
  cardBrand?: string | null;
  billingStreet?: string | null;
  billingSuburb?: string | null;
  billingState?: string | null;
  billingPostcode?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BookingPerson = { firstName?: string; lastName?: string; email?: string; phoneNumber?: string };

export type PriceLine = { label: string; amount: number };

export type Booking = {
  id: string;
  bookingReference?: string;
  status?: BookingStatus | string;
  isActive?: boolean;
  holdExpiresAt?: string | null;
  carId?: string;
  car?: Car;
  pickupDate?: string;
  pickupTime?: string;
  pickupLocation?: string;
  returnDate?: string;
  returnTime?: string;
  returnLocation?: string;
  rentalDays?: number;
  basePrice?: number;
  extrasPrice?: number;
  discount?: number;
  totalPrice?: number;
  createdAt?: string;
  /** List rows: a flattened renter and latest payment. */
  customer?: { name?: string; email?: string; phoneNumber?: string };
  payment?: Payment;
  /** Detail: full records. */
  user?: { id?: string; name?: string; email?: string };
  bookingPersonDetails?: BookingPerson[];
  payments?: Payment[];
  extraServices?: ExtraService[];
  airportShuttles?: { shuttleService?: boolean; price?: number }[];
  driverInfo?: DriverInfo | null;
  summary?: PriceLine[];
  gstIncluded?: boolean;
  /** Only on a fresh PAY_NOW booking: the Stripe PaymentIntent client secret. */
  clientSecret?: string;
  [key: string]: unknown;
};

export type DashboardStats = {
  revenue?: { collected?: number };
  bookings?: { total?: number; pending?: number; confirmed?: number; completed?: number; cancelled?: number };
  cars?: { total?: number; available?: number };
  users?: { total?: number };
  drivers?: { total?: number };
};

export type BookingSummary = {
  total?: number;
  pending?: number;
  confirmed?: number;
  completed?: number;
  cancelled?: number;
  payNow?: number;
  payAtDesk?: number;
  awaitingDeskPayment?: number;
  collectedRevenue?: number;
};

export type Estimate = {
  isAvailable?: boolean;
  unavailableReason?: string | null;
  rentalDetails?: { rentalDays?: number };
  pricing?: {
    dailyCarRate?: number;
    rentalDays?: number;
    subtotal?: number;
    discount?: number;
    discountPercentage?: number;
    totalPrice?: number;
    payNowTotal?: number;
    payAtDeskTotal?: number;
    gstIncluded?: boolean;
    summary?: PriceLine[];
    freeCancellationHours?: number;
  };
};

export type TripInput = {
  carId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  extraServiceIds: string[];
  airportShuttle: boolean;
};

export type CreateBookingInput = TripInput & {
  pickupLocation: string;
  returnLocation: string;
  bookingPersonDetails: { firstName: string; lastName: string; email: string; phoneNumber: string };
  payment: {
    paymentOption: PaymentOption;
    paymentMethod?: string;
    billingAddress?: { street: string; suburb: string; state: string; postcode: string };
  };
};

export type SearchQuery = {
  pickupLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  age?: string | number;
  carType?: string;
  transmission?: string;
};
