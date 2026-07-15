// =====================================================
// Database connection (Neon serverless driver)
// =====================================================
// Works in:
// - Vercel Serverless Functions
// - Vercel Edge Functions
// - Local Node.js scripts
// =====================================================

import { neon, neonConfig, Pool } from "@neondatabase/serverless";

let cachedPool = null;

/**
 * Get raw SQL executor (for one-shot queries)
 * Usage: const sql = getSql(); const rows = await sql`SELECT 1`;
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  // Cache connections in production for performance
  if (process.env.NODE_ENV === "production") {
    neonConfig.fetchConnectionCache = true;
  }

  return neon(url);
}

/**
 * Get connection pool (for transactions, multiple queries in one function)
 * Usage:
 *   const pool = getPool();
 *   const client = await pool.connect();
 *   try { await client.query(...); } finally { client.release(); }
 */
export function getPool() {
  if (cachedPool) return cachedPool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  cachedPool = new Pool({ connectionString: url });
  return cachedPool;
}
