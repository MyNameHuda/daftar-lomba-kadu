// =====================================================
// GET    /api/contests/:id  — get contest detail + participants (public, sorted)
// PUT    /api/contests/:id  — update contest (admin)
// DELETE /api/contests/:id  — delete contest + participants (admin)
// =====================================================
//
// NOTE: age_min/age_max are no longer part of the contest entity.
// The age range is derived from `category` via api/_lib/ageRange.js.

import { getSql } from "../_lib/db.js";
import { requireAdmin } from "../_lib/middleware.js";
import { validateContestInput } from "../_lib/validation.js";
import {
  ok,
  badRequest,
  notFound,
  handleCors,
  serverError,
} from "../_lib/response.js";

export const config = { runtime: "nodejs" };

export const fetch = async function handler(request, context) {
  if (request.method === "OPTIONS") return handleCors(request);

  // Debug: log what Vercel actually sends us
  console.log("[contests/[id]] url=", request.url, "context.params=", context?.params, "context keys=", context ? Object.keys(context) : "no context");

  // Vercel should give us context.params.id, but in Node.js Web Fetch runtime
  // it's not always populated. Fall back to parsing the URL path.
  let rawId = context?.params?.id;
  if (!rawId) {
    try {
      const pathname = new URL(request.url).pathname;
      const m = pathname.match(/\/api\/contests\/([^/]+)/);
      if (m) rawId = m[1];
    } catch {}
  }
  const contestId = Number(rawId);
  console.log("[contests/[id]] rawId=", rawId, "contestId=", contestId);
  if (!Number.isInteger(contestId) || contestId <= 0) {
    return badRequest("ID lomba tidak valid", request);
  }

  if (request.method === "GET") return handleGet(contestId);
  if (request.method === "PUT") return handlePut(request, contestId);
  if (request.method === "DELETE") return handleDelete(request, contestId);
  return badRequest("Method tidak diizinkan", request);
};

async function handleGet(contestId) {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, name, category, sub_category, created_at
      FROM contests
      WHERE id = ${contestId}
      LIMIT 1
    `;
    if (rows.length === 0) return notFound("Lomba tidak ditemukan");

    const participants = await sql`
      SELECT id, name, age, created_at
      FROM participants
      WHERE contest_id = ${contestId}
      ORDER BY age ASC, name ASC
    `;

    return ok({ contest: rows[0], participants });
  } catch (err) {
    console.error("Get contest error:", err);
    return serverError("Gagal memuat lomba");
  }
}

async function handlePut(request, contestId) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body harus JSON");
  }

  const validation = validateContestInput(body);
  if (!validation.valid) {
    return badRequest(validation.error);
  }

  const data = validation.data;
  try {
    const sql = getSql();
    const rows = await sql`
      UPDATE contests
      SET
        name = ${data.name},
        category = ${data.category},
        sub_category = ${data.sub_category}
      WHERE id = ${contestId}
      RETURNING id, name, category, sub_category, created_at
    `;
    if (rows.length === 0) return notFound("Lomba tidak ditemukan");
    return ok({ contest: rows[0] });
  } catch (err) {
    console.error("Update contest error:", err);
    return serverError("Gagal memperbarui lomba");
  }
}

async function handleDelete(request, contestId) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const sql = getSql();
    const rows = await sql`
      DELETE FROM contests WHERE id = ${contestId}
      RETURNING id
    `;
    if (rows.length === 0) return notFound("Lomba tidak ditemukan");
    return ok({ deleted: true, id: contestId });
  } catch (err) {
    console.error("Delete contest error:", err);
    return serverError("Gagal menghapus lomba");
  }
}
