
import { getSql } from "../_lib/db.js";
import { requireAdmin } from "../_lib/middleware.js";
import { validateContestInput } from "../_lib/validation.js";
import {
  ok,
  created,
  badRequest,
  handleCors,
  serverError,
} from "../_lib/response.js";

export const config = { runtime: "nodejs" };

export const fetch = async function handler(request) {
  if (request.method === "OPTIONS") return handleCors(request);

  if (request.method === "GET") {
    return handleList(request);
  }
  if (request.method === "POST") {
    return handleCreate(request);
  }
  return badRequest("Method tidak diizinkan", request);
};

async function handleList(_request) {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        c.id, c.name, c.category, c.sub_category, c.created_at,
        COALESCE(p.participant_count, 0) AS participant_count
      FROM contests c
      LEFT JOIN (
        SELECT contest_id, COUNT(*)::int AS participant_count
        FROM participants
        GROUP BY contest_id
      ) p ON p.contest_id = c.id
      ORDER BY
        CASE c.category
          WHEN 'balita' THEN 1
          WHEN 'anak' THEN 2
          WHEN 'ibu-ibu' THEN 3
          ELSE 4
        END,
        c.created_at DESC
    `;
    return ok({ contests: rows });
  } catch (err) {
    console.error("List contests error:", err);
    return serverError("Gagal memuat lomba");
  }
}

async function handleCreate(request) {
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
      WITH new_contest AS (
        INSERT INTO contests (name, category, sub_category)
        VALUES (${data.name}, ${data.category}, ${data.sub_category})
        RETURNING id, name, category, sub_category, created_at
      ),
      prev AS (
        SELECT c.id, c.name
        FROM contests c
        WHERE c.category = ${data.category}
          AND c.sub_category IS NOT DISTINCT FROM ${data.sub_category}
          AND c.id <> (SELECT id FROM new_contest)
          AND EXISTS (
            SELECT 1 FROM participants p WHERE p.contest_id = c.id
          )
        ORDER BY c.created_at DESC
        LIMIT 1
      ),
      copied AS (
        INSERT INTO participants (contest_id, name, age)
        SELECT (SELECT id FROM new_contest), p.name, p.age
        FROM participants p
        WHERE p.contest_id = (SELECT id FROM prev)
        RETURNING id
      )
      SELECT
        (SELECT row_to_json(n.*) FROM new_contest n) AS contest,
        (
          SELECT json_build_object(
            'id',    p.id,
            'name',  p.name,
            'count', (SELECT COUNT(*)::int FROM copied)
          )
          FROM prev p
        ) AS copied_from
    `;

    const result = rows[0] ?? { contest: null, copied_from: null };
    return created(result);
  } catch (err) {
    console.error("Create contest error:", err);
    return serverError("Gagal membuat lomba");
  }
}
