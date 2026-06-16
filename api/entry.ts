// esbuild entry — bundled into api/server.mjs by api/build.mjs
// NOT a Vercel function. Exports the Express app + an init() for DB migrations.
import app from "../artifacts/api-server/src/app.js";
import { applyMigrations, seedIfEmpty } from "../artifacts/api-server/src/data/seed.js";

let initialized = false;

export async function init(): Promise<void> {
  if (initialized) return;
  initialized = true;
  await applyMigrations();
  await seedIfEmpty();
}

export default app;
