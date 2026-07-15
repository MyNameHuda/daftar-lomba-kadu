// =====================================================
// Debug: List tables & constraints
// =====================================================

import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log("Tables:", tables.rows);

    const constraints = await client.query(`
      SELECT conname, conrelid::regclass AS table_name
      FROM pg_constraint
      WHERE connamespace = 'public'::regnamespace
      ORDER BY conname
    `);
    console.log("Constraints:", constraints.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
