// =====================================================
// PUT    /api/participants/:id  — update participant (admin)
// DELETE /api/participants/:id  — delete participant (admin)
// =====================================================

import { getSql } from "../_lib/db.js";
import { requireAdmin } from "../_lib/middleware.js";
import { validateParticipantInput } from "../_lib/validation.js";
import {
  ok,
  badRequest,
  notFound,
  handleCors,
  serverError,
} from "../_lib/response.js";

export const config = { runtime: "nodejs" };

export default async function handler(request, context) {
  if (request.method === "OPTIONS") return handleCors();

  const { id } = context.params || {};
  const participantId = Number(id);
  if (!Number.isInteger(participantId) || participantId <= 0) {
    return badRequest("ID peserta tidak valid");
  }

  if (request.method === "PUT") return handlePut(request, participantId);
  if (request.method === "DELETE") return handleDelete(request, participantId);
  return badRequest("Method tidak diizinkan");
}

async function handlePut(request, participantId) {
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
    const rows = await sql`
      UPDATE participants
      SET name = ${validation.data.name}, age = ${validation.data.age}
      WHERE id = ${participantId}
      RETURNING id, name, age, created_at
    `;
    if (rows.length === 0) return notFound("Peserta tidak ditemukan");
    return ok({ participant: rows[0] });
  } catch (err) {
    console.error("Update participant error:", err);
    return serverError("Gagal memperbarui peserta");
  }
}

async function handleDelete(request, participantId) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const sql = getSql();
    const rows = await sql`
      DELETE FROM participants WHERE id = ${participantId}
      RETURNING id
    `;
    if (rows.length === 0) return notFound("Peserta tidak ditemukan");
    return ok({ deleted: true, id: participantId });
  } catch (err) {
    console.error("Delete participant error:", err);
    return serverError("Gagal menghapus peserta");
  }
}
