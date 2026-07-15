// =====================================================
// Response helpers
// =====================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

/**
 * Build a JSON response
 * @param {number} status
 * @param {object} body
 */
export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

export const ok = (body) => json(200, body);
export const created = (body) => json(201, body);
export const badRequest = (message) => json(400, { error: message });
export const unauthorized = (message = "Unauthorized") =>
  json(401, { error: message });
export const forbidden = (message = "Forbidden") =>
  json(403, { error: message });
export const notFound = (message = "Not found") => json(404, { error: message });
export const serverError = (message = "Internal server error") =>
  json(500, { error: message });

/**
 * Handle CORS preflight
 */
export function handleCors() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
