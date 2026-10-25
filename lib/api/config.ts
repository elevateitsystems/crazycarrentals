export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api").replace(/\/+$/, "");
export const TOKEN_KEY = "crazycar.token";
export const AUTH_EXPIRED_EVENT = "crazycar:auth-expired";

// Admin requests never carry a token from the browser: they go to this same-origin route handler,
// which attaches the admin JWT from an httpOnly cookie (see app/api/admin).
export const ADMIN_PROXY_PATH = "/api/admin/proxy";
export const ADMIN_SESSION_PATH = "/api/admin/session";
export const ADMIN_EXPIRED_EVENT = "crazycar:admin-expired";
export const ADMIN_FORBIDDEN_EVENT = "crazycar:admin-forbidden";
/** Name of the httpOnly cookie holding the admin JWT (never readable from page scripts). */
export const ADMIN_COOKIE = "ccr_admin";
