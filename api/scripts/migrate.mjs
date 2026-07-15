// =====================================================
// Migration: Run schema.sql against DATABASE_URL
// Usage: npm run db:migrate
// =====================================================

import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Strip SQL comment lines starting with --
 * Preserves everything else (including newlines inside strings)
 */
function stripComments(sql) {
  return sql
    .split("\n")
    .map((line) => {
      // Find "--" that's not inside a string literal (simple heuristic: outside quotes)
      let inSingle = false;
      let inDouble = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        const next = line[i + 1];
        if (!inSingle && !inDouble && c === "'" ) inSingle = !inSingle;
        else if (!inSingle && !inDouble && c === '"') inDouble = !inDouble;
        else if (!inSingle && !inDouble && c === "-" && next === "-") {
          return line.slice(0, i).trimEnd();
        }
      }
      return line;
    })
    .join("\n");
}

/**
 * Split SQL into individual statements (handling $...$ dollar-quoted blocks)
 */
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let dollarTag = null;

  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    const next = sql[i + 1];

    if (dollarTag) {
      // Inside dollar-quoted block. Preserve the closing $tag$ in output.
      if (c === "$" && sql.slice(i, i + dollarTag.length) === dollarTag) {
        // Closing tag: add it to output, then exit block mode
        current += dollarTag;
        const skip = dollarTag.length - 1;
        for (let k = 0; k < skip; k++) i++;
        dollarTag = null;
      } else {
        current += c;
      }
      continue;
    }

    if (!inSingle && !inDouble && c === "'") {
      inSingle = true;
      current += c;
    } else if (!inSingle && !inDouble && c === '"') {
      inDouble = true;
      current += c;
    } else     if (!inSingle && !inDouble && c === "$") {
      // Detect $tag$ — opening of a dollar-quoted block
      const tagMatch = sql.slice(i).match(/^\$([a-zA-Z_]*)\$/);
      if (tagMatch) {
        // Add the opening $tag$ to output, then enter "inside block" mode
        current += tagMatch[0];
        dollarTag = tagMatch[0];
        const skip = dollarTag.length - 1;
        for (let k = 0; k < skip; k++) i++;
      } else {
        current += c;
      }
    } else if (inSingle && c === "'" && next === "'") {
      current += "''";
      i++;
    } else if (inDouble && c === '"' && next === '"') {
      current += '""';
      i++;
    } else if (inSingle && c === "'") {
      inSingle = false;
      current += c;
    } else if (inDouble && c === '"') {
      inDouble = false;
      current += c;
    } else if (!inSingle && !inDouble && c === ";") {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
    } else {
      current += c;
    }
  }

  const last = current.trim();
  if (last) statements.push(last);

  return statements;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL belum di-set");
    console.error("   → Set di .env (lihat .env.example)");
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, "..", "_lib", "sql", "schema.sql");
  const raw = await readFile(schemaPath, "utf8");
  const cleaned = stripComments(raw);
  const statements = splitStatements(cleaned);

  console.log(`📜 Parsed ${statements.length} statement(s) from schema.sql`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log("🔌 Connecting ke Neon...");

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.split("\n")[0].slice(0, 70);
      try {
        await client.query(stmt);
        console.log(`  [${i + 1}/${statements.length}] ✅ ${preview}...`);
      } catch (err) {
        console.error(`  [${i + 1}/${statements.length}] ❌ ${preview}...`);
        console.error(`     ${err.message}`);
        throw err;
      }
    }

    console.log("\n✅ Schema berhasil di-migrate");
  } catch (err) {
    console.error("\n❌ Migration gagal:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
