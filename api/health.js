// =====================================================
// GET /api/health — quick liveness check (no DB)
// Useful to tell apart "function infrastructure broken"
// from "DB or auth code is slow".
// =====================================================

export const config = { runtime: "nodejs" };

export default async function handler(request) {
  return new Response(
    JSON.stringify({
      ok: true,
      runtime: "nodejs",
      nodeVersion: process.version,
      region: process.env.VERCEL_REGION ?? "local",
      ts: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
