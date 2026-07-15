// =====================================================
// GET  /api/contests/:id/participants  — list sorted participants
// POST /api/contests/:id/participants  — add participant (admin)
// =====================================================
//
// The age range is derived from the contest's `category` via
// api/_lib/ageRange.js — no age_min/age_max columns on contests anymore.

import { getSql } from "../../_lib/db.js";
import { requireAdmin } from "../../_lib/middleware.js";
import {
  validateParticipantInput,
  validateAgeForCategory,
} from "../../_lib/validation.js";
import {
  ok,
  created,
  badRequest,
  notFound,
  handleCors,
  serverError,
} from "../../_lib/response.js";

export const config = { runtime: "nodejs" };

export const fetch = async function handler(request, context) {
  if (request.method === "OPTIONS") return handleCors(request);

  let rawId = context?.params?.id;
  if (!rawId) {
    try {
      const pathname = new URL(request.url).pathname;
      const m = pathname.match(/\/api\/contests\/([^/]+)/);
      if (m) rawId = m[1];
    } catch {}
  }
  const contestId = Number(rawId);
  if (!Number.isInteger(contestId) || contestId <= 0) {
    return badRequest("ID lomba tidak valid", request);
  }

  if (request.method === "GET") return handleList(contestId);
  if (request.method === "POST") return handleCreate(request, contestId);
  return badRequest("Method tidak diizinkan", request);
};

async function handleList(contestId) {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, name, age, created_at
      FROM participants
      WHERE contest_id = ${contestId}
      ORDER BY age ASC, name ASC
    `;
    return ok({ participants: rows });
  } catch (err) {
    console.error("List participants error:", err);
    return serverError("Gagal memuat peserta");
  }
}

async function handleCreate(request, contestId) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Body harus JSON");
  }

  const validation = validateParticipantInput(body);
  if (!validation.valid) {
    return badRequest(validation.error);
  }

  try {
    const sql = getSql();
    const contestRows = await sql`
      SELECT id, category FROM contests WHERE id = ${contestId} LIMIT 1
    `;
    if (contestRows.length === 0) return notFound("Lomba tidak ditemukan");
    const { category } = contestRows[0];

    // System-derived age range check
    const ageErr = validateAgeForCategory(validation.data.age, category);
    if (ageErr) return badRequest(ageErr.error);

    const rows = await sql`
      INSERT INTO participants (contest_id, name, age)
      VALUES (${contestId}, ${validation.data.name}, ${validation.data.age})
      RETURNING id, name, age, created_at
    `;
    return created({ participant: rows[0] });
  } catch (err) {
    console.error("Create participant error:", err);
    return serverError("Gagal menambah peserta");
  }
}
