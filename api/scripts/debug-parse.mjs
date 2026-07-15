// Debug: print parsed SQL statements (uses same parser as migrate.mjs)
import { readFile } from "node:fs/promises";

function stripComments(sql) {
  return sql
    .split("\n")
    .map((line) => {
      let inSingle = false, inDouble = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i], next = line[i + 1];
        if (!inSingle && !inDouble && c === "'") inSingle = !inSingle;
        else if (!inSingle && !inDouble && c === '"') inDouble = !inDouble;
        else if (!inSingle && !inDouble && c === "-" && next === "-") return line.slice(0, i).trimEnd();
      }
      return line;
    })
    .join("\n");
}

function splitStatements(sql) {
  const stmts = []; let cur = ""; let inS = false, inD = false, dTag = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (dTag) {
      if (c === "$" && sql.slice(i, i + dTag.length) === dTag) {
        cur += dTag;
        const skip = dTag.length - 1;
        for (let k = 0; k < skip; k++) i++;
        dTag = null;
      } else {
        cur += c;
      }
      continue;
    }
    if (!inS && !inD && c === "'") { inS = true; cur += c; }
    else if (!inS && !inD && c === '"') { inD = true; cur += c; }
    else     if (!inS && !inD && c === "$") {
      const m = sql.slice(i).match(/^\$([a-zA-Z_]*)\$/);
      if (m) {
        cur += m[0];
        dTag = m[0];
        const skip = dTag.length - 1;
        for (let k = 0; k < skip; k++) i++;
      } else cur += c;
    } else if (inS && c === "'" && sql[i + 1] === "'") { cur += "''"; i++; }
    else if (inD && c === '"' && sql[i + 1] === '"') { cur += '""'; i++; }
    else if (inS && c === "'") { inS = false; cur += c; }
    else if (inD && c === '"') { inD = false; cur += c; }
    else if (!inS && !inD && c === ";") { const t = cur.trim(); if (t) stmts.push(t); cur = ""; }
    else cur += c;
  }
  if (cur.trim()) stmts.push(cur.trim());
  return stmts;
}

const raw = await readFile("api/_lib/sql/schema.sql", "utf8");
const cleaned = stripComments(raw);
const stmts = splitStatements(cleaned);
console.log("Number of statements:", stmts.length);
stmts.forEach((s, i) => {
  console.log(`\n--- [${i + 1}] (${s.length} chars) ---`);
  console.log(s);
});
