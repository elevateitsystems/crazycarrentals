"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { paymentsApi } from "@/lib/api/services";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Stripe.js, initialised with the publishable key the backend hands out at GET /payments/config.
 * Nothing Stripe-related is configured in the frontend; the secret key exists only on the backend.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = paymentsApi
      .config()
      .then((res) => {
        const key = res.data?.publishableKey;
        if (!key || !key.startsWith("pk_")) throw new Error("Card payments aren't configured on the server yet.");
        return loadStripe(key);
      })
      .catch((err) => {
        stripePromise = null; // allow a retry after a network blip
        throw err;
      });
  }
  return stripePromise;
}

/** Remembers which booking a redirect-based payment belongs to, so /book/payment-return can finish it. */
const PENDING_KEY = "crazycar.pendingPayment";
export type PendingPayment = { bookingId: string; email: string; carId: string; reference?: string };

export const pendingPayment = {
  save(p: PendingPayment) {
    try {
      window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
    } catch {}
  },
  read(): PendingPayment | null {
    try {
      const raw = window.sessionStorage.getItem(PENDING_KEY);
      return raw ? (JSON.parse(raw) as PendingPayment) : null;
    } catch {
      return null;
    }
  },
  clear() {
    try {
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch {}
  },
};
