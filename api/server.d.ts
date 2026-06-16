// Type declarations for the esbuild bundle (api/server.mjs)
// Keeps Vercel's TS checker away from artifacts/api-server source files.
import type { Express } from "express";

export declare function init(): Promise<void>;
declare const app: Express;
export default app;
