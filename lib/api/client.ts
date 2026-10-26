import { ADMIN_EXPIRED_EVENT, ADMIN_FORBIDDEN_EVENT, ADMIN_PROXY_PATH, API_URL, AUTH_EXPIRED_EVENT, TOKEN_KEY } from "@/lib/api/config";
import type { ApiResult, PageMeta } from "@/lib/api/types";

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const tokenStore = {
  get(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

type Query = Record<string, string | number | boolean | null | undefined>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
  /** "admin" routes through the same-origin proxy, which adds the admin token server-side. */
  session?: "customer" | "admin";
  /** Customer requests only: use this token instead of the stored one (e.g. to inspect a fresh login). */
  token?: string;
};

function buildUrl(base: string, path: string, query?: Query) {
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function messageFrom(body: unknown, fallback: string) {
  if (isRecord(body)) {
    // Validation failures arrive as { message: "Validation failed", errors: [{ field, message }] }.
    const fieldErrors = Array.isArray(body.errors)
      ? body.errors.filter(isRecord).map((e) => (typeof e.field === "string" && e.field ? `${e.field}: ${e.message}` : String(e.message)))
      : [];
    const m = body.message ?? body.error;
    const head = typeof m === "string" && m ? m : Array.isArray(m) && m.length ? m.join(", ") : "";
    if (fieldErrors.length) return `${head || "Validation failed"} — ${fieldErrors.join("; ")}`;
    if (head) return head;
  }
  return fallback;
}

/** Accepts the pagination shapes commonly returned by REST backends. */
export function readMeta(raw: unknown): PageMeta | undefined {
  if (!isRecord(raw)) return undefined;
  const candidate = [raw.meta, raw.pagination, isRecord(raw.data) ? raw.data.meta : undefined, isRecord(raw.data) ? raw.data.pagination : undefined].find(isRecord);
  if (!candidate) return undefined;
  const page = Number(candidate.page ?? candidate.currentPage ?? 1);
  const limit = Number(candidate.limit ?? candidate.perPage ?? candidate.pageSize ?? 10);
  const total = Number(candidate.total ?? candidate.totalItems ?? candidate.count ?? 0);
  const totalPages = Number(candidate.totalPages ?? candidate.pages ?? (limit ? Math.ceil(total / limit) : 1));
  if (!Number.isFinite(total) || !Number.isFinite(totalPages)) return undefined;
  return { page, limit, total, totalPages: Math.max(totalPages, 1) };
}

/**
 * The backend wraps every response as `{ success, message, data, pagination? }`; lists are `data: [...]`.
 * (Don't dig for arrays inside `data`: detail objects have array fields too, e.g. a driver's `cars`.)
 */
function unwrap<T>(raw: unknown): ApiResult<T> {
  const message = isRecord(raw) && typeof raw.message === "string" ? raw.message : undefined;
  const data = isRecord(raw) && "data" in raw ? raw.data : raw;
  return { data: data as T, meta: readMeta(raw), message, raw };
}

export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const { method = "GET", body, query, signal, session = "customer" } = options;
  const admin = session === "admin";
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = admin ? null : options.token ?? (typeof window !== "undefined" ? tokenStore.get() : null);
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // the browser sets the multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(admin ? ADMIN_PROXY_PATH : API_URL, path, query), {
      method,
      headers,
      body: payload,
      signal,
      ...(admin ? { credentials: "same-origin", cache: "no-store" } : {}),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("Cannot reach the server. Check your connection or the API URL.", 0);
  }

  const text = await res.text();
  let raw: unknown = null;
  if (text) {
    try {
      raw = JSON.parse(text);
    } catch {
      raw = text;
    }
  }

  if (!res.ok) {
    if (admin) {
      // 401: the admin cookie is gone or the token expired. 403: the backend no longer treats this account as an admin.
      if (res.status === 401) window.dispatchEvent(new Event(ADMIN_EXPIRED_EVENT));
      else if (res.status === 403) window.dispatchEvent(new Event(ADMIN_FORBIDDEN_EVENT));
    } else if (res.status === 401 && token && !options.token) {
      tokenStore.clear();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(messageFrom(raw, res.statusText || `Request failed (${res.status})`), res.status, raw);
  }
  return unwrap<T>(raw);
}

export function toList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
