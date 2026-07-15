// =====================================================
// GET /api/auth/me
// Returns: { admin: { id, username } }  (jika token valid)
// =====================================================

import { requireAdmin } from "../_lib/middleware.js";
import { ok, handleCors } from "../_lib/response.js";

export const config = { runtime: "nodejs" };

export default async function handler(request) {
  if (request.method === "OPTIONS") return handleCors();
  if (request.method !== "GET") {
    return ok({ error: "Method not allowed" });
  }

  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  return ok({ admin: { id: auth.id, username: auth.username } });
}
