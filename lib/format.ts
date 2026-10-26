import { API_URL } from "@/lib/api/config";
import type { Car, ExtraService } from "@/lib/api/types";

function absolute(url: string) {
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${new URL(API_URL).origin}/${url.replace(/^\/+/, "")}`;
}

export function money(value: unknown) {
  const n = typeof value === "string" ? Number(value) : (value as number);
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
}

export function carName(car?: Car | null) {
  if (!car) return "Vehicle";
  return [car.brand, car.model].filter(Boolean).join(" ") || "Vehicle";
}

export function carImage(car?: Car | null): string | null {
  // Booking list rows carry a single `image` thumbnail instead of `images`.
  const first = car?.images?.[0] ?? car?.image;
  if (!first) return null;
  const url = typeof first === "string" ? first : first.url;
  return url ? absolute(url) : null;
}

export function carImages(car?: Car | null): string[] {
  return (car?.images ?? []).map((i) => (typeof i === "string" ? i : i.url ?? "")).filter(Boolean).map(absolute);
}

export function carFeatures(car?: Car | null): string[] {
  return listField(car?.features);
}

/** `features` / `safetyRatings` come back as arrays, but older records may hold a comma or JSON string. */
export function listField(f: unknown): string[] {
  if (Array.isArray(f)) return f.map(String);
  if (typeof f === "string") {
    try {
      const parsed = JSON.parse(f);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return f.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function extraLabel(extra: ExtraService) {
  return extra.name ?? extra.id;
}

export function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "—";
  const d = new Date(value);
  // Calendar dates (pickup/return, licence expiry) are stored as UTC midnight; don't shift them by the viewer's zone.
  const dateOnly = /^\d{4}-\d{2}-\d{2}($|T00:00:00(\.000)?Z$)/.test(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", ...(dateOnly ? { timeZone: "UTC" } : {}) });
}

export function humanize(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** "AUTOMATIC" / "PAY_AT_DESK" -> "Automatic" / "Pay at desk". */
export function enumLabel(value?: string | null) {
  if (!value) return "";
  if (/^[A-Za-z]{1,3}$/.test(value)) return value.toUpperCase(); // SUV, AWD
  const s = value.replace(/[_-]+/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** A real instant (createdAt, holdExpiresAt, payment updates) in the viewer's local time. */
export function formatTimestamp(value: unknown) {
  if (typeof value !== "string" || !value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
}

export function formatDateTime(date: unknown, time?: unknown) {
  const d = formatDate(date);
  return typeof time === "string" && time ? `${d}, ${time}` : d;
}
