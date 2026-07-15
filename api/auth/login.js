// =====================================================
// POST /api/auth/login
// Body: { username, password }
// Returns: { token, admin: { id, username } }
// =====================================================

import { getSql } from "../_lib/db.js";
import { signToken, verifyPassword } from "../_lib/auth.js";
import { ok, badRequest, unauthorized, handleCors, serverError } from "../_lib/response.js";

export const config = { runtime: "nodejs" };

export default async function handler(request) {
  if (request.method === "OPTIONS") return handleCors();
  if (request.method !== "POST") {
    return badRequest("Method tidak diizinkan");
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body harus JSON");
  }

  const username = (body?.username ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!username || !password) {
    return badRequest("Username dan password wajib diisi");
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, username, password_hash
      FROM admins
      WHERE username = ${username}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return unauthorized("Username atau password salah");
    }

    const admin = rows[0];
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return unauthorized("Username atau password salah");
    }

    const token = signToken({ id: admin.id, username: admin.username });
    return ok({
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    return serverError("Login gagal");
  }
}
