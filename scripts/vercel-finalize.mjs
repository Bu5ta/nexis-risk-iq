// Post-build step for Vercel deployments.
// Assembles the Vercel Build Output API v3 structure in .vercel/output/:
//   static/          ← Vite-built frontend (from artifacts/nexis/dist)
//   functions/api/index.func/  ← Express serverless handler + bundle
//   config.json      ← routes config
import { cp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";

// Use process.cwd() — Vercel runs the build from the repo root (/vercel/path0)
const root = process.cwd();
const out = path.join(root, ".vercel", "output");
console.log(`Building Vercel output at: ${out}`);

// Clean previous output
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// ── 1. Static frontend files ─────────────────────────────────────────────────
const staticDir = path.join(out, "static");
const viteDist = path.join(root, "artifacts", "nexis", "dist");
await cp(viteDist, staticDir, { recursive: true });
console.log("✓ Static files copied to .vercel/output/static/");

// ── 2. Serverless function ───────────────────────────────────────────────────
const funcDir = path.join(out, "functions", "api", "index.func");
await mkdir(funcDir, { recursive: true });

// Copy handler and bundle
await cp(path.join(root, "api", "index.js"), path.join(funcDir, "index.js"));
await cp(path.join(root, "api", "server.mjs"), path.join(funcDir, "server.mjs"));

// Vercel function config
await writeFile(
  path.join(funcDir, ".vc-config.json"),
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "index.js",
    maxDuration: 30,
    memory: 512,
    environment: [],
  }, null, 2)
);
console.log("✓ Function written to .vercel/output/functions/api/index.func/");

// ── 3. Routes config ─────────────────────────────────────────────────────────
await writeFile(
  path.join(out, "config.json"),
  JSON.stringify({
    version: 3,
    routes: [
      // Cache immutable hashed assets
      {
        src: "/assets/(.*)",
        headers: { "cache-control": "public, max-age=31536000, immutable" },
        continue: true,
      },
      // Serve static files that exist on disk
      { handle: "filesystem" },
      // API → serverless function
      { src: "/api/(.*)", dest: "/api/index" },
      // SPA fallback
      { src: "/(.*)", dest: "/index.html" },
    ],
  }, null, 2)
);
console.log("✓ .vercel/output/config.json written");
console.log("Build Output API structure ready.");
