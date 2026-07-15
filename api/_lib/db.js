// =====================================================
// Database connection (Neon serverless driver)
// =====================================================
// Works in:
// - Vercel Serverless Functions
// - Local Node.js scripts (migrate / seed / reset)
// =====================================================
//
// We cache the `neon()` SQL tag at module scope so the underlying HTTP/2
// connection is reused for every query in the same Node.js process.
// Without this, every `getSql()` call would create a fresh connection —
// slow + can hit Vercel's 10s function timeout on Neon cold start.
// =====================================================

import { neon, Pool } from "@neondatabase/serverless";

let cachedSql = null;
let cachedPool = null;

function getUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

/**
 * Get raw SQL executor (for one-shot queries).
 * The function is created once and reused for the lifetime of the process.
 * Usage: const sql = getSql(); const rows = await sql`SELECT 1`;
 */
export function getSql() {
  if (!cachedSql) {
    cachedSql = neon(getUrl());
  }
  return cachedSql;
}

/**
 * Get connection pool (for transactions, multiple queries in one function)
 * Usage:
 *   const pool = getPool();
 *   const client = await pool.connect();
 *   try { await client.query(...); } finally { client.release(); }
 */
export function getPool() {
  if (!cachedPool) {
    cachedPool = new Pool({ connectionString: getUrl() });
  }
  return cachedPool;
}
