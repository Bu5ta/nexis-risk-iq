// Builds api/entry.ts → api/server.mjs for Vercel deployment
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const apiDir = path.dirname(fileURLToPath(import.meta.url));

await rm(path.join(apiDir, "server.mjs"), { force: true });

await esbuild({
  entryPoints: [path.join(apiDir, "entry.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile: path.join(apiDir, "server.mjs"),
  logLevel: "info",
  external: [
    "*.node", "sharp", "bcrypt", "argon2", "fsevents", "pg-native",
    "bufferutil", "utf-8-validate", "lightningcss",
  ],
  banner: {
    js: `import { createRequire as __crReq } from 'node:module';
import __bPath from 'node:path';
import __bUrl from 'node:url';
globalThis.require = __crReq(import.meta.url);
globalThis.__filename = __bUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bPath.dirname(globalThis.__filename);
`,
  },
});

console.log("✓ api/server.mjs built");
