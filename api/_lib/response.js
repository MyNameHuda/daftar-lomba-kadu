// =====================================================
// Response helpers
// =====================================================
//
// CORS strategy:
// - We do NOT use cookies (auth is via Bearer token in Authorization header),
//   so `Access-Control-Allow-Credentials` is intentionally omitted — sending
//   it together with `Access-Control-Allow-Origin: *` is a spec violation.
// - Same-origin requests (Vercel SPA + API on the same domain) skip CORS
//   entirely; CORS only kicks in for cross-origin (e.g. local dev where
//   frontend is on 5173 and API on 3001).
// - For cross-origin, prefer `FRONTEND_ORIGIN` env var. If unset, fall back
//   to echoing the request's `Origin` header (dynamic allow).
// =====================================================

function pickOrigin(request) {
  const allowed = process.env.FRONTEND_ORIGIN;
  if (allowed && allowed !== "*") return allowed;
  // Echo the request's Origin (browser sends it on cross-origin XHR/fetch).
  // If there's no Origin header (e.g. same-origin), respond with "*" — that's
  // valid without credentials.
  return request?.headers?.get("origin") ?? "*";
}

const BASE_CORS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  Vary: "Origin",
};

function corsFor(request) {
  return { "Access-Control-Allow-Origin": pickOrigin(request), ...BASE_CORS };
}

/**
 * Build a JSON response
 * @param {number} status
 * @param {object} body
 * @param {Request} [request]  pass the incoming Request so we can echo its Origin
 */
export function json(status, body, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsFor(request),
    },
  });
}

export const ok = (body, request) => json(200, body, request);
export const created = (body, request) => json(201, body, request);
export const badRequest = (message, request) => json(400, { error: message }, request);
export const unauthorized = (message = "Unauthorized", request) =>
  json(401, { error: message }, request);
export const forbidden = (message = "Forbidden", request) =>
  json(403, { error: message }, request);
export const notFound = (message = "Not found", request) => json(404, { error: message }, request);
export const serverError = (message = "Internal server error", request) =>
  json(500, { error: message }, request);

/**
 * Handle CORS preflight
 * @param {Request} [request]
 */
export function handleCors(request) {
  return new Response(null, { status: 204, headers: corsFor(request) });
}
