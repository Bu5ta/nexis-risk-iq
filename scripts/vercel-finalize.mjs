// Post-build step for Vercel deployments.
// Assembles the Vercel Build Output API v3 structure in .vercel/output/
// Creates output in BOTH repo root AND artifacts/api-server so the deployment
// works regardless of whether Vercel's "Root Directory" is blank or "artifacts/api-server".
import { cp, mkdir, writeFile, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const routes = {
  version: 3,
  routes: [
    // API first — before filesystem so it's never shadowed by static files
    { src: "/api(.*)", dest: "/api" },
    {
      src: "/assets/(.*)",
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      continue: true,
    },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index.html" },
  ],
};

async function createOutput(base) {
  const out = path.join(base, ".vercel", "output");
  console.log(`\nBuilding Vercel output at: ${out}`);

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  // 1. Static frontend files
  const staticDir = path.join(out, "static");
  const viteDist = path.join(repoRoot, "artifacts", "nexis", "dist");
  await cp(viteDist, staticDir, { recursive: true });
  console.log(`  ✓ Static files → .vercel/output/static/`);

  // 2. Serverless function — named api.func so it maps to the /api path in routes
  const funcDir = path.join(out, "functions", "api.func");
  await mkdir(funcDir, { recursive: true });

  // Copy as .mjs — Node.js always executes .mjs as ESM regardless of package.json,
  // bypassing Vercel's ESM→CJS transpilation that breaks dynamic import("./server.mjs")
  await copyFile(path.join(repoRoot, "api", "index.js"), path.join(funcDir, "index.mjs"));
  await copyFile(path.join(repoRoot, "api", "server.mjs"), path.join(funcDir, "server.mjs"));

  await writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify(
      { runtime: "nodejs22.x", handler: "index.mjs", maxDuration: 30, memory: 512 },
      null,
      2
    )
  );
  console.log(`  ✓ Function → .vercel/output/functions/api.func/`);

  // 3. Routes config
  await writeFile(path.join(out, "config.json"), JSON.stringify(routes, null, 2));
  console.log(`  ✓ config.json written`);
}

// Create output for BOTH possible rootDirectory settings
await createOutput(repoRoot);
await createOutput(path.join(repoRoot, "artifacts", "api-server"));

console.log("\nBuild Output API structure ready (both locations).");
