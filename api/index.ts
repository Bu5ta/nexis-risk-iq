// Vercel serverless handler — Express app as a single function
// Built by vercel:build → api/build.mjs → api/server.mjs
import type { IncomingMessage, ServerResponse } from "node:http";

// Dynamic import so Vercel doesn't try to resolve the bundle at build time
const { default: app } = await import("./server.mjs");

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
