// =====================================================
// Auth middleware
// =====================================================

import { extractBearerToken, verifyToken } from "./auth.js";
import { unauthorized } from "./response.js";

/**
 * Verify request has a valid admin JWT.
 * Returns the admin payload on success, or a Response on failure.
 *
 * Usage:
 *   const auth = await requireAdmin(request);
 *   if (auth instanceof Response) return auth;
 *   // auth.id, auth.username available
 */
export async function requireAdmin(request) {
  const token = extractBearerToken(request.headers.get("authorization"));
  if (!token) {
    return unauthorized("Token tidak ditemukan");
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return unauthorized("Token tidak valid");
  }

  return { id: payload.sub, username: payload.username };
}
