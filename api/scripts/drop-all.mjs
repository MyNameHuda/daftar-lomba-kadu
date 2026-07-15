// Drop ALL tables/functions in public schema (hard reset)
import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log("🗑️  Dropping all tables & functions in public schema...");
    await client.query(`DROP SCHEMA public CASCADE`);
    await client.query(`CREATE SCHEMA public`);
    console.log("✅ Schema reset");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
