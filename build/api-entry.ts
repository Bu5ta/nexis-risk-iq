// esbuild entry — bundled into api/server.mjs by build/api-build.mjs
// NOT a Vercel function. Exports an Express request handler as default + init() for DB setup.
import { createApp } from "../artifacts/api-server/src/app.js";
import type { IncomingMessage, ServerResponse } from "node:http";

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let _app: Handler | null = null;
let initialized = false;

export async function init(): Promise<void> {
  if (initialized) return;
  initialized = true;

  let apiRouter: import("express").IRouter;

  const hasDbUrl = Boolean(process.env["DATABASE_URL"]) && !process.env["DATABASE_URL"]?.includes("db.example.com");

  if (hasDbUrl) {
    try {
      const { testDbConnection } = await import("@workspace/db");
      const dbOk = await testDbConnection();
      if (dbOk) {
        const { applyMigrations, seedIfEmpty } = await import("../artifacts/api-server/src/data/seed.js");
        await applyMigrations();
        await seedIfEmpty();
        const { default: dbRouter } = await import("../artifacts/api-server/src/routes/index.js");
        apiRouter = dbRouter;
      } else {
        const { default: mockRouter } = await import("../artifacts/api-server/src/routes/mock-router.js");
        apiRouter = mockRouter;
      }
    } catch {
      const { default: mockRouter } = await import("../artifacts/api-server/src/routes/mock-router.js");
      apiRouter = mockRouter;
    }
  } else {
    const { default: mockRouter } = await import("../artifacts/api-server/src/routes/mock-router.js");
    apiRouter = mockRouter;
  }

  _app = createApp(apiRouter) as unknown as Handler;
}

// The default export is a stable request handler set up once init() resolves.
// api/index.js assigns this before calling init(), then uses it to handle requests.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (!_app) {
    (res as ServerResponse & { statusCode: number }).statusCode = 503;
    res.end("Server initialising — please retry.");
    return;
  }
  return _app(req, res);
}
