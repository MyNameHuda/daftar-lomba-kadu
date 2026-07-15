// =====================================================
// Seed: Create default admin from env vars
// Usage: npm run db:seed
// =====================================================

import "dotenv/config";
import { Pool } from "@neondatabase/serverless";
import { hashPassword } from "../_lib/auth.js";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum di-set");
    process.exit(1);
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET belum di-set (lihat .env.example)");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log("🔌 Connecting ke Neon...");
    console.log(`👤 Seeding admin: ${username}`);

    const passwordHash = await hashPassword(password);

    // Upsert admin (idempotent)
    await client.query(
      `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, passwordHash]
    );

    const result = await client.query(
      `SELECT id, username, created_at FROM admins WHERE username = $1`,
      [username]
    );
    console.log("✅ Admin berhasil di-seed:");
    console.log(`   id: ${result.rows[0].id}`);
    console.log(`   username: ${result.rows[0].username}`);
    console.log(`   created_at: ${result.rows[0].created_at}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   username: ${username}`);
    console.log(`   password: ${password}`);
    console.log(`\n⚠️  Jangan lupa ganti password setelah deploy!`);
  } catch (err) {
    console.error("❌ Seed gagal:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
