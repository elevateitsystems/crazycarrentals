import { NextResponse, type NextRequest } from "next/server";
import { API_URL } from "@/lib/api/config";
import { ADMIN_COOKIE, isSameOrigin } from "@/lib/server/admin-session";

type Ctx = { params: Promise<{ path: string[] }> };

// Only the backend areas the admin dashboard uses can be reached with the admin token.
const ALLOWED = [/^admin\/dashboard$/, /^admin\/extras(\/|$)/, /^admin\/protections(\/|$)/, /^bookings\/admin(\/|$)/, /^auth\/users$/, /^auth\/user\//, /^drivers\//, /^cars(\/|$)/, /^payments\/config$/];

function fail(status: number, message: string) {
  return NextResponse.json({ success: false, message }, { status });
}

async function forward(req: NextRequest, { params }: Ctx) {
  const { path } = await params;
  if (path.some((seg) => seg === "" || seg === "." || seg === ".." || seg.includes("/"))) return fail(400, "Invalid path.");
  const joined = path.join("/");
  if (!ALLOWED.some((re) => re.test(joined))) return fail(404, "Not an admin API route.");

  const method = req.method;
  if (method !== "GET" && !isSameOrigin(req)) return fail(403, "Cross-site request rejected.");

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return fail(401, "Your admin session has ended. Please sign in again.");

  const headers: Record<string, string> = { Accept: "application/json", Authorization: `Bearer ${token}` };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType; // keeps the multipart boundary for image uploads

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`, {
      method,
      headers,
      body: method === "GET" ? undefined : await req.arrayBuffer(),
      cache: "no-store",
    });
  } catch {
    return fail(502, "Cannot reach the server. Check your connection or the API URL.");
  }

  const res = new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
  });
  if (upstream.status === 401) res.cookies.delete(ADMIN_COOKIE);
  return res;
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
