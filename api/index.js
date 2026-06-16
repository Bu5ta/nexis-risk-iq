// Vercel serverless handler — plain JS, no TypeScript checking overhead.
// api/server.mjs is built from api/entry.ts by `node api/build.mjs` during vercel:build.

let _initialized = false;
let _app = null;

async function boot() {
  if (_initialized) return;
  _initialized = true;
  const mod = await import("./server.mjs");
  _app = mod.default;
  await mod.init();
}

export default async function handler(req, res) {
  await boot();
  return _app(req, res);
}
