import { request } from "@/lib/api/client";
import type {
  Booking,
  BookingSummary,
  Car,
  CreateBookingInput,
  DashboardStats,
  Driver,
  Estimate,
  DailyRatesInput,
  DailyRatesResult,
  ExtraService,
  Protection,
  ProtectionInput,
  ExtrasCatalog,
  TripInput,
  User,
} from "@/lib/api/types";

type Query = Record<string, string | number | boolean | null | undefined>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** `/auth/me` nests the profile twice: `{ data: { data: { user } } }`. Accepts either depth. */
export function readUser(data: unknown): User | null {
  let node: unknown = data;
  for (let i = 0; i < 3 && isRecord(node); i++) {
    if (isRecord(node.user)) return node.user as User;
    if (typeof node.id === "string" && typeof node.email === "string") return node as User;
    node = node.data;
  }
  return null;
}

export const authApi = {
  login: (body: { email: string; password: string }) => request<{ user?: User; token?: string }>("/auth/login", { method: "POST", body }),
  register: (body: { name: string; email: string; password: string }) => request<{ user?: User; token?: string }>("/auth/register", { method: "POST", body }),
  forgotPassword: (body: { email: string }) => request<unknown>("/auth/forget-password", { method: "POST", body }),
  resetPassword: (body: { id: string; otp: number; newPassword: string }) => request<unknown>("/auth/reset-password", { method: "POST", body }),
  changePassword: (body: { oldPassword: string; newPassword: string; confirmPassword: string }) => request<unknown>("/auth/change-password", { method: "POST", body }),
  me: async (token?: string) => {
    const res = await request<unknown>("/auth/me", { token });
    return { ...res, data: readUser(res.data) };
  },
  updateProfile: (body: FormData) => request<User>("/auth/profile", { method: "PATCH", body }),
};

export const carsApi = {
  list: (query?: Query) => request<Car[]>("/cars", { query }),
  search: (query: Query) => request<Car[]>("/cars/search", { query }),
  get: (id: string) => request<Car>(`/cars/${id}`),
};

export const bookingsApi = {
  extras: () => request<ExtrasCatalog>("/bookings/extras"),
  estimate: (body: TripInput & { paymentOption: string }) => request<Estimate>("/bookings/estimate", { method: "POST", body }),
  create: (body: CreateBookingInput) => request<Booking>("/bookings", { method: "POST", body }),
  /** Tells the backend the card payment went through; it re-checks the PaymentIntent with Stripe before confirming. */
  confirmPayment: (id: string, body: { email: string; stripePaymentIntentId: string }) =>
    request<Booking>(`/bookings/${id}/confirm-payment`, { method: "POST", body }),
  mine: () => request<Booking[]>("/bookings/my-bookings"),
  mineById: (id: string) => request<Booking>(`/bookings/my-bookings/${id}`),
  /** A signed-in renter is identified by their token; a guest must send the booking email. */
  cancel: (id: string, body: { reason?: string; email?: string }) => request<unknown>(`/bookings/${id}/cancel`, { method: "POST", body }),
};

export const paymentsApi = {
  /** Returns the Stripe publishable key only; the secret key never leaves the backend. */
  config: () => request<{ publishableKey?: string }>("/payments/config"),
};

const admin = { session: "admin" } as const;

export const adminApi = {
  dashboard: () => request<DashboardStats>("/admin/dashboard", admin),
  bookingSummary: () => request<BookingSummary>("/bookings/admin/summary", admin),
  /** Filters: page, limit, status, paymentOption, paymentStatus, searchTerm, sortBy, sortOrder. */
  bookings: (query?: Query) => request<Booking[]>("/bookings/admin/all", { ...admin, query }),
  booking: (id: string) => request<Booking>(`/bookings/admin/${id}`, admin),
  confirmBooking: (id: string) => request<Booking>(`/bookings/admin/confirm/${id}`, { ...admin, method: "POST" }),
  completeBooking: (id: string) => request<Booking>(`/bookings/admin/complete/${id}`, { ...admin, method: "POST" }),
  collectPayment: (id: string) => request<Booking>(`/bookings/admin/collect-payment/${id}`, { ...admin, method: "POST" }),
  cancelBooking: (id: string, reason: string) => request<unknown>(`/bookings/admin/cancel/${id}`, { ...admin, method: "POST", body: { reason } }),

  cars: (query?: Query) => request<Car[]>("/cars", { ...admin, query }),
  createCar: (body: FormData) => request<Car>("/cars/add-new-car", { ...admin, method: "POST", body }),
  updateCar: (id: string, body: FormData) => request<Car>(`/cars/update-car/${id}`, { ...admin, method: "PATCH", body }),
  /** Calendar date prices for one car, for the dates from..to (YYYY-MM-DD). */
  dailyRates: (carId: string, query: { from: string; to: string }) =>
    request<DailyRatesResult>(`/cars/${carId}/daily-rates`, { ...admin, query }),
  saveDailyRates: (carId: string, body: DailyRatesInput) =>
    request<DailyRatesResult>(`/cars/${carId}/daily-rates`, { ...admin, method: "PUT", body }),
  deleteCar: (id: string) => request<unknown>(`/cars/delete-car/${id}`, { ...admin, method: "DELETE" }),
  /** `null` removes the assigned driver. */
  assignDriver: (id: string, driverId: string | null) => request<Car>(`/cars/${id}/assign-driver`, { ...admin, method: "PATCH", body: { driverId } }),

  /** Filters: page, limit, role, searchTerm. */
  users: (query?: Query) => request<User[]>("/auth/users", { ...admin, query }),
  user: (id: string) => request<User>(`/auth/user/${id}`, admin),
  updateUser: (id: string, body: Record<string, unknown>) => request<User>(`/auth/user/update/${id}`, { ...admin, method: "PATCH", body }),
  // The collection lists this as PATCH, but the backend only routes DELETE (PATCH returns 404 "Route not found").
  deleteUser: (id: string) => request<unknown>(`/auth/user/delete/${id}`, { ...admin, method: "DELETE" }),

  /** Filters: page, limit, searchTerm. */
  drivers: (query?: Query) => request<Driver[]>("/drivers/all", { ...admin, query }),
  driver: (id: string) => request<Driver>(`/drivers/${id}`, admin),
  createDriver: (body: Record<string, unknown>) => request<Driver>("/drivers/add", { ...admin, method: "POST", body }),
  updateDriver: (id: string, body: Record<string, unknown>) => request<Driver>(`/drivers/update/${id}`, { ...admin, method: "PATCH", body }),
  deleteDriver: (id: string) => request<unknown>(`/drivers/delete/${id}`, { ...admin, method: "DELETE" }),

  /** Not paginated: the backend returns every extra, active or not. */
  extras: () => request<ExtraService[]>("/admin/extras/all", admin),
  createExtra: (body: { name: string; pricePerDay: number }) => request<ExtraService>("/admin/extras/add", { ...admin, method: "POST", body }),
  updateExtra: (id: string, body: { name?: string; pricePerDay?: number; isActive?: boolean }) =>
    request<ExtraService>(`/admin/extras/update/${id}`, { ...admin, method: "PATCH", body }),
  deleteExtra: (id: string) => request<unknown>(`/admin/extras/delete/${id}`, { ...admin, method: "DELETE" }),

  /** Protection packages shown on the booking page. Not paginated. */
  protections: () => request<Protection[]>("/admin/protections/all", admin),
  createProtection: (body: ProtectionInput) => request<Protection>("/admin/protections/add", { ...admin, method: "POST", body }),
  updateProtection: (id: string, body: Partial<ProtectionInput>) =>
    request<Protection>(`/admin/protections/update/${id}`, { ...admin, method: "PATCH", body }),
  deleteProtection: (id: string) => request<unknown>(`/admin/protections/delete/${id}`, { ...admin, method: "DELETE" }),

  paymentConfig: () => request<{ publishableKey?: string }>("/payments/config", admin),
};
