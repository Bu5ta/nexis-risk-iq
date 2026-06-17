import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type { IRouter } from "express";
import type { IncomingMessage } from "node:http";
import type { ServerResponse } from "node:http";
import { logger } from "./lib/logger.js";

export function createApp(apiRouter: IRouter) {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((pinoHttp as any)({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: unknown }) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res: ServerResponse) {
        return { statusCode: res.statusCode };
      },
    },
  }));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  return app;
}
