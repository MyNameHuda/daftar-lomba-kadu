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
 * Run a query with a hard timeout. Prevents one bad connection
 * from hanging the function all the way to Vercel's 10s gateway
 * timeout (which becomes an opaque 504 FUNCTION_INVOCATION_TIMEOUT).
 *
 * Default 5s is well under Vercel's free-plan 10s cap, leaving
 * headroom for response serialization.
 *
 * @template T
 * @param {Promise<T>} p
 * @param {number} [ms=5000]
 * @returns {Promise<T>}
 */
export function withTimeout(p, ms = 5000) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(t));
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
