import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// Paths with non-ASCII characters or spaces arrive percent-encoded in file:// URLs.
test("audit and demo run from a non-ASCII path with spaces", async () => {
  const base = await mkdtemp(join(tmpdir(), "agi1-paths-"));
  const copy = join(base, "通用版 demo");
  try {
    await cp(repoRoot, copy, {
      recursive: true,
      filter: (src) => !src.includes("node_modules") && !src.endsWith(".git")
    });

    const audit = await run(process.execPath, [join(copy, "scripts", "audit-boundary.mjs")]);
    assert.match(audit.stdout, /Boundary audit passed/);

    const demo = await run(process.execPath, [join(copy, "src", "index.js")]);
    assert.ok(JSON.parse(demo.stdout).status);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
