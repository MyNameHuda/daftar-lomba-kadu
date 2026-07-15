// =====================================================
// Reset: Drop all data and re-run schema + seed
// Usage: npm run db:reset
// =====================================================

import "dotenv/config";
import { Pool } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../_lib/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum di-set");
    process.exit(1);
  }

  console.log("⚠️  RESET akan HAPUS SEMUA DATA (lomba, peserta, admin)");
  console.log("   Tekan Ctrl+C dalam 3 detik untuk cancel...");
  await new Promise((r) => setTimeout(r, 3000));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log("🔌 Connecting...");
    const schemaPath = path.join(__dirname, "..", "_lib", "sql", "schema.sql");
    const sql = await readFile(schemaPath, "utf8");
    await client.query(sql);
    console.log("✅ Schema re-applied (semua data lama udah hilang)");

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const hash = await hashPassword(password);
    await client.query(
      `INSERT INTO admins (username, password_hash) VALUES ($1, $2)`,
      [username, hash]
    );
    console.log(`✅ Admin re-seeded: ${username} / ${password}`);
  } catch (err) {
    console.error("❌ Reset gagal:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
