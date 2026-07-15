// =====================================================
// POST /api/auth/login
// Body: { username, password }
// Returns: { token, admin: { id, username } }
// =====================================================

import { getSql, withTimeout } from "../_lib/db.js";
import { signToken, verifyPassword } from "../_lib/auth.js";
import { ok, badRequest, unauthorized, handleCors, serverError } from "../_lib/response.js";

export const config = { runtime: "nodejs" };

// Vercel function signature: `export const fetch` triggers the Web Fetch API
// handler style. Using `export default` makes Vercel treat the file as a
// Node.js HTTP handler `(req, res) => void` — in that style the returned
// Response is ignored and the function hangs to 10s, returning 504.
// See: https://vercel.com/docs/functions/functions-api-reference
export const fetch = async function handler(request) {
  const t0 = Date.now();
  const log = (label, extra = "") =>
    console.log(
      `[login] ${label} +${Date.now() - t0}ms${extra ? " " + extra : ""}`
    );

  if (request.method === "OPTIONS") return handleCors(request);
  if (request.method !== "POST") {
    return badRequest("Method tidak diizinkan", request);
  }
  log("start", `region=${process.env.VERCEL_REGION ?? "local"}`);

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body harus JSON", request);
  }

  const username = (body?.username ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!username || !password) {
    return badRequest("Username dan password wajib diisi", request);
  }

  try {
    const sql = getSql();
    log("getSql cached");

    const rows = await withTimeout(
      sql`
        SELECT id, username, password_hash
        FROM admins
        WHERE username = ${username}
        LIMIT 1
      `,
      5000
    );
    log("query done", `rows=${rows.length}`);

    if (rows.length === 0) {
      return unauthorized("Username atau password salah", request);
    }

    const admin = rows[0];
    const valid = await verifyPassword(password, admin.password_hash);
    log("bcrypt done", `valid=${valid}`);
    if (!valid) {
      return unauthorized("Username atau password salah", request);
    }

    const token = signToken({ id: admin.id, username: admin.username });
    log("token signed");
    return ok(
      {
        token,
        admin: { id: admin.id, username: admin.username },
      },
      request
    );
  } catch (err) {
    console.error(`[login] FAIL +${Date.now() - t0}ms:`, err);
    return serverError("Login gagal", request);
  }
};
