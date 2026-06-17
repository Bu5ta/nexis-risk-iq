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
    {
      src: "/assets/(.*)",
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      continue: true,
    },
    { handle: "filesystem" },
    { src: "/api/(.*)", dest: "/api/index" },
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

  // 2. Serverless function
  const funcDir = path.join(out, "functions", "api", "index.func");
  await mkdir(funcDir, { recursive: true });

  await copyFile(path.join(repoRoot, "api", "index.js"), path.join(funcDir, "index.js"));
  await copyFile(path.join(repoRoot, "api", "server.mjs"), path.join(funcDir, "server.mjs"));

  // Tell Vercel this is an ESM bundle — prevents CJS transpilation that breaks dynamic imports
  await writeFile(
    path.join(funcDir, "package.json"),
    JSON.stringify({ type: "module" }, null, 2)
  );

  await writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify(
      { runtime: "nodejs22.x", handler: "index.js", maxDuration: 30, memory: 512, launcherType: "Nodejs", shouldAddHelpers: false },
      null,
      2
    )
  );
  console.log(`  ✓ Function → .vercel/output/functions/api/index.func/`);

  // 3. Routes config
  await writeFile(path.join(out, "config.json"), JSON.stringify(routes, null, 2));
  console.log(`  ✓ config.json written`);
}

// Create output for BOTH possible rootDirectory settings
await createOutput(repoRoot);
await createOutput(path.join(repoRoot, "artifacts", "api-server"));

console.log("\nBuild Output API structure ready (both locations).");
