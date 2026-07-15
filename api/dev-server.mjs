// =====================================================
// Local dev server for API (Vite proxies /api/* to this)
// Usage: npm run dev:api  (in separate terminal, alongside npm run dev)
// =====================================================

import "dotenv/config";
import { createServer } from "node:http";
import { Pool } from "@neondatabase/serverless";

// Map URL paths to API handlers
const routes = [
  {
    method: "POST",
    pattern: /^\/api\/auth\/login$/,
    load: () => import("./auth/login.js").then((m) => m.fetch),
  },
  {
    method: "GET",
    pattern: /^\/api\/auth\/me$/,
    load: () => import("./auth/me.js").then((m) => m.fetch),
  },
  {
    methods: ["GET", "POST"],
    pattern: /^\/api\/contests$/,
    load: () => import("./contests/index.js").then((m) => m.fetch),
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    pattern: /^\/api\/contests\/(\d+)$/,
    load: () => import("./contests/[id].js").then((m) => m.fetch),
  },
  {
    methods: ["GET", "POST"],
    pattern: /^\/api\/contests\/(\d+)\/participants$/,
    load: () =>
      import("./contests/[id]/participants.js").then((m) => m.fetch),
  },
  {
    methods: ["PUT", "DELETE"],
    pattern: /^\/api\/participants\/(\d+)$/,
    load: () => import("./participants/[id].js").then((m) => m.fetch),
  },
];

const port = Number(process.env.API_PORT || 3001);
const url = process.env.DATABASE_URL;

if (!url) {
  console.error("❌ DATABASE_URL belum di-set (lihat .env.example)");
  process.exit(1);
}

// Warm up the pool
new Pool({ connectionString: url });

const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  const pathname = new URL(req.url, `http://localhost`).pathname;

  for (const route of routes) {
    if (route.pattern.test(pathname)) {
      if (route.methods && !route.methods.includes(req.method)) continue;
      if (route.method && route.method !== req.method) continue;

      try {
        const handler = await route.load();

        // Convert Node req to Web Request
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const rawBody = Buffer.concat(chunks).toString("utf8");

        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) {
          if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv));
          else if (v) headers.set(k, v);
        }

        const webRequest = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers,
          body:
            rawBody && ["POST", "PUT", "DELETE"].includes(req.method)
              ? rawBody
              : undefined,
        });

        // Extract path params (e.g. :id from /api/contests/123)
        const match = pathname.match(route.pattern);
        const params = {};
        if (match && match[1] !== undefined) {
          params.id = match[1];
        }

        const webResponse = await handler(webRequest, { params });

        // Convert Web Response back to Node res
        const resHeaders = {};
        webResponse.headers.forEach((v, k) => {
          resHeaders[k] = v;
        });
        res.writeHead(webResponse.status, resHeaders);
        const buf = Buffer.from(await webResponse.arrayBuffer());
        res.end(buf);
        return;
      } catch (err) {
        console.error("Handler error:", err);
        // In dev, surface the real cause so it's debuggable.
        // In prod, keep the generic message (no info leak).
        const isProd = process.env.NODE_ENV === "production";
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Internal server error",
            ...(isProd
              ? {}
              : { message: err?.message, code: err?.code, stack: err?.stack }),
          }),
        );
        return;
      }
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`🚀 API dev server: http://localhost:${port}`);
  console.log(`   Proxy target untuk Vite: http://localhost:${port}/api/*`);
});
