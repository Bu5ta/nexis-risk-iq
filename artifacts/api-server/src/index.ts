import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  let apiRouter;

  if (process.env["DATABASE_URL"]) {
    try {
      const { testDbConnection } = await import("@workspace/db");
      const dbOk = await testDbConnection();

      if (dbOk) {
        logger.info("Database connection verified — using DB-backed routes");
        const { seedIfEmpty, applyMigrations } = await import("./data/seed.js");
        await applyMigrations();
        await seedIfEmpty();
        const { default: dbRouter } = await import("./routes/index.js");
        apiRouter = dbRouter;
      } else {
        logger.warn("Database unreachable — falling back to in-memory mock data");
        const { default: mockRouter } = await import("./routes/mock-router.js");
        apiRouter = mockRouter;
      }
    } catch (err) {
      logger.warn({ err }, "Database initialisation failed — falling back to in-memory mock data");
      const { default: mockRouter } = await import("./routes/mock-router.js");
      apiRouter = mockRouter;
    }
  } else {
    logger.info("No DATABASE_URL — using in-memory mock data");
    const { default: mockRouter } = await import("./routes/mock-router.js");
    apiRouter = mockRouter;
  }

  const app = createApp(apiRouter);

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

start().catch(err => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
