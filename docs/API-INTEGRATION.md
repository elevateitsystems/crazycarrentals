# Backend API integration

Base URL: `NEXT_PUBLIC_API_URL` (see `.env.example`; `.env.local` is git-ignored). Endpoints are declared once in
`lib/api/services.ts` and called through `lib/api/client.ts`. Response shapes in `lib/api/types.ts` were checked against
the live backend (the Insomnia collection has request bodies but no response examples).

Every response is `{ success, message, data, pagination? }`; lists are `data: [...]` with
`pagination: { total, page, limit, totalPages }` (default `limit` 10). Validation errors add `errors: [{ field, message }]`,
which the client folds into the error message.

## Sign-in: one form, role from the backend

`/auth/signin` is the only login page. It calls `POST /auth/login` and routes on `data.user.role`
(falling back to `GET /auth/me` if a response ever lacks it):

- `ADMIN` / `SUPER_ADMIN` → the token is handed to `POST /api/admin/session`, which sets the admin cookie, then
  `/admin/dashboard` (or `next` if it is an `/admin/*` page).
- `USER` → token and user are stored as the customer session, then `/my-bookings` (or `next` if it isn't an admin page).

`/auth/register` is customers only: it sends `name`, `email`, `password` (never a role), stores the returned
`data.token` and `data.user`, and goes to `/my-bookings`.

## Sessions: customer and admin are kept apart

| | Customer | Admin |
| --- | --- | --- |
| Sign in | `/auth/signin` (role `USER`) | `/auth/signin` (role `ADMIN`) → `POST /api/admin/session { token }` |
| Token storage | `localStorage` (`crazycar.token`) | `httpOnly`, `SameSite=Strict`, `Secure` (prod) cookie `ccr_admin` — unreadable from page JS |
| How requests carry it | `Authorization: Bearer` from the browser | Browser calls same-origin `/api/admin/proxy/<backend path>`; the route handler adds the Bearer token |
| Code | `lib/auth.tsx`, `components/RequireAuth.tsx` | `lib/admin-auth.tsx`, `lib/server/admin-session.ts`, `app/api/admin/*`, `app/(admin)/components/AdminGuard.tsx`, `proxy.ts` |

**Who counts as an admin is decided by the backend, never by the frontend, an email, or a decoded token.** The role in
the login response only picks the route; the session route then calls `GET /auth/me` and `GET /bookings/admin/summary`
with the token, and sets the cookie only if the backend serves that admin-only endpoint (a customer token gets
`403 Admin role required`). `GET /api/admin/session` repeats that check on every dashboard load.

- `proxy.ts` redirects `/admin/*` to `/auth/signin?next=…` when there's no admin cookie (optimistic only), and `/admin`
  to `/admin/dashboard`. A signed-in customer sent there is told the account has no admin access.
- Proxy route: only admin path prefixes are forwarded (`admin/dashboard`, `bookings/admin/*`, `auth/users`, `auth/user/*`,
  `drivers/*`, `cars*`, `payments/config`); writes must carry a same-site `Origin` header (CSRF). Bodies are passed through
  unchanged, so multipart car images keep their boundary.
- 401 from the backend clears the cookie and the UI returns to `/auth/signin?reason=expired`. A 403 triggers a re-check;
  if the role is gone the session ends with `reason=forbidden`.
- Admin tokens are never stored in `localStorage`; old ones found there are discarded.
- Production must be served over HTTPS (the cookie is `Secure` when `NODE_ENV=production`; `localhost` is exempt in browsers).

## Endpoint → page map

| Page | Endpoints |
| --- | --- |
| `/`, `/fleet` | `GET /cars` |
| `/rent-a-car` | `GET /cars` (carType, transmission, maxPrice, sortBy, sortOrder, page, limit), `GET /cars/search` |
| `/fleet/[id]` | `GET /cars/:id` |
| `/book/[id]` | `GET /cars/:id`, `GET /bookings/extras`, `POST /bookings/estimate`, `POST /bookings`, `GET /payments/config`, Stripe Payment Element, `POST /bookings/:id/confirm-payment`, `POST /bookings/:id/cancel` |
| `/book/payment-return` | `POST /bookings/:id/confirm-payment` or `POST /bookings/:id/cancel` (after a redirect-based payment) |
| `/auth/*` | `POST /auth/login`, `GET /auth/me`, `POST /auth/register`, `POST /auth/forget-password`, `POST /auth/reset-password` |
| `/my-bookings`, `/my-bookings/[id]` | `GET /bookings/my-bookings`, `GET /bookings/my-bookings/:id`, `POST /bookings/:id/cancel` |
| `/admin/dashboard` | `GET /admin/dashboard`, `GET /bookings/admin/summary`, `GET /bookings/admin/all?limit=5&sortBy=createdAt` |
| `/admin/bookings` | `GET /bookings/admin/all` (page, limit, searchTerm, status, paymentOption, paymentStatus, sortBy, sortOrder) |
| `/admin/bookings/[id]` | `GET /bookings/admin/:id`, `POST /bookings/admin/{confirm,collect-payment,complete,cancel}/:id` |
| `/admin/payments` | `GET /payments/config`, `GET /bookings/admin/summary`, `GET /bookings/admin/all` (payment filters), `POST /bookings/admin/collect-payment/:id` |
| `/admin/fleet-management` | `GET /cars` (page, limit, searchTerm), `POST /cars/add-new-car`, `PATCH /cars/update-car/:id`, `DELETE /cars/delete-car/:id`, `PATCH /cars/:id/assign-driver` (`driverId: null` unassigns), `GET /drivers/all` |
| `/admin/drivers` | `GET /drivers/all` (page, limit, searchTerm), `POST /drivers/add`, `PATCH /drivers/update/:id`, `DELETE /drivers/delete/:id` |
| `/admin/customers` | `GET /auth/users` (page, limit, role, searchTerm), `GET /auth/user/:id`, `PATCH /auth/user/update/:id`, `DELETE /auth/user/delete/:id` |

## Payments (Stripe)

1. `POST /bookings` with `PAY_NOW` returns the booking (`status: PENDING`, `holdExpiresAt` = +30 min) and a `clientSecret`.
2. The card step loads Stripe.js with the publishable key from `GET /payments/config` and mounts the Payment Element.
3. `stripe.confirmPayment({ redirect: "if_required" })` charges the card. Declines keep the hold so the customer can retry.
4. `POST /bookings/:id/confirm-payment { email, stripePaymentIntentId }` — the backend re-checks the PaymentIntent with
   Stripe (`400 Card payment has not succeeded yet` otherwise) and confirms the booking.
5. If step 4 never happens (tab closed), staff use **Confirm Pay Now hold** on the booking, which succeeds only if Stripe
   already has the money. Cancelling a paid booking marks the payment `REFUNDED`.

`PAY_AT_DESK` bookings are `CONFIRMED` immediately with payment `PENDING_AT_DESK`; staff record the payment with
**Collect desk payment** (booking detail or `/payments`).

## Differences from the Insomnia collection

- `DELETE /auth/user/delete/:id`, not `PATCH` (the backend answers `PATCH` with `404 Route not found`).
- `GET /auth/me` nests the profile as `data.data.user`; the login response has no `role`.
- `GET /bookings/extras` returns `{ extras, airportShuttle, discounts }`, extras priced `pricePerDay`.
- `POST /bookings/estimate` returns `{ isAvailable, unavailableReason, pricing: { summary[], totalPrice, … } }`.
- Car enums accepted by the backend: carType `SEDAN | HATCHBACK | LUXURY | ELECTRIC_CARS | COMMERCIAL`,
  fuelType `PETROL | DIESEL | HYBRID | ELECTRIC | LPG`, transmission `AUTOMATIC | MANUAL`. Other values cause a 500, so the
  admin form uses fixed selects. `description` is required.
- Drivers: `age` is sent as `"25"` or `"25+"` and returned as a number. Cars reference their driver by `driverInfoId`.
- User roles: `USER | ADMIN | SUPER_ADMIN`.
- `pricePerDay` is sent without the stray trailing tab in the collection's field name.

## Known gaps / backend issues

- **Guest cancel doesn't check the email**: `POST /bookings/:id/cancel` with a wrong `email` still cancels the booking.
  Anyone holding a booking id can cancel it. Needs a backend fix.
- **Images point at `http://localhost:9000`** (MinIO). They only load on the backend's own machine and show as broken
  images everywhere else. The backend needs a public storage URL.
- Invalid car enum values return `500 Internal server error` instead of a 400.
- `POST /bookings/admin/collect-payment/:id` succeeds again on an already-collected booking (the UI only offers it while
  the payment is `PENDING_AT_DESK`).
- Unknown filter values aren't rejected (`paymentStatus=NOPE` simply matches nothing), so the payment-status filter only
  lists values seen in real data: `PENDING`, `PENDING_AT_DESK`, `COMPLETED`, `REFUNDED`.
- No payments list/history endpoint exists (only `GET /payments/config`); payment history comes from each booking's
  `payments[]`, and the Payments page is built on the booking list's payment filters.
- `isAvailable` on a car cannot be changed through `PATCH /cars/update-car/:id`.
- No settings, contact-form, or admin create-user endpoints, so those stay static / absent.

## Loading states

Every indicator is driven by a real pending request; nothing uses timers or fake data.

| Situation | Component |
| --- | --- |
| Route/session waits (route change via `loading.tsx`, `RequireAuth`, `AdminGuard`, vehicle and payment-return pages) | `components/BrandLoader.tsx` (logo + ring) |
| First load of a table or vehicle grid | `TableSkeleton` / `CardGridSkeleton` (`components/Feedback.tsx`) |
| Re-fetch with data already on screen (filters, paging, after a mutation) | `Refreshing`: keeps content visible, dimmed, with a progress bar (`useAsync().refreshing`) |
| Buttons and small actions | `<Button loading>` (spinner, `aria-busy`, disabled) |
| Duplicate-submit protection | `hooks/use-busy.ts`: a ref-based guard that runs one action at a time (admin CRUD, cancellations, card payment) |

Failures end every state: errors render through `ErrorState` (with retry) or an inline `Notice`, and spinners clear in `finally`.
