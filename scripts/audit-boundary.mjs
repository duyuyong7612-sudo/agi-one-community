import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const rx = (parts, flags = "") => new RegExp(parts.join(""), flags);
const cp = (...codes) => String.fromCodePoint(...codes);
const bannedPatterns = [
  rx(["backend", "\\/"]),
  rx(["electron", "\\/"]),
  rx(["ui", "\\/jarvis"]),
  rx([cp(0x4e09, 0x6bb5, 0x5f0f), ".*", cp(0x72b6, 0x6001, 0x673a)]),
  rx([cp(0x58f0, 0x7eb9), ".*", cp(0x95e8, 0x63a7)]),
  rx([cp(0x786c, 0x6253, 0x65ad), ".*", cp(0x4f18, 0x5316)]),
  rx([["hy", "brid"].join(""), ".*", ["rou", "ting"].join("")], "i"),
  rx(["batch", "_", "actions"]),
  rx(["parallel", "_", "tool", "_", "calls"]),
  rx(["previous", "_", "response", "_", "id"]),
  rx(["PPAV", "_", "BRAIN", "_", "DEFINITION"]),
  rx(["SAY", "_", "SYSTEM"]),
  rx(["AGI1", "_", "MIO", "_", "TOKEN"]),
  rx(["OPENAI", "_", "API", "_", "KEY", "\\s*="]),
  rx(["ANTHROPIC", "_", "API", "_", "KEY", "\\s*="]),
  rx(["sk-", "[A-Za-z0-9_-]{20,}"]),
  rx(["https:\\/\\/agioneos\\.com\\/api"]),
  rx(["adu", "_", "work", "_", "definition"]),
  rx(["mio", "_", "billing"])
];

const allowedMentions = new Map([
  ["README.md", [/batch action chains/, /AGI-1 cloud service/, /AGI-1 commercial cloud service/]],
  ["CONTRIBUTING.md", [/batch action chains/]],
  ["SECURITY.md", [/AGI-1 cloud routes/]],
  ["docs/BOUNDARY.md", [/multi-action batch chains/, /Hybrid realtime voice/]]
]);

const files = await listFiles(root);
const failures = [];

for (const file of files) {
  if (file.includes("node_modules/")) continue;
  const rel = relative(root, file);
  const text = await readFile(file, "utf8");
  for (const pattern of bannedPatterns) {
    if (!pattern.test(text)) continue;
    const allowed = (allowedMentions.get(rel) || []).some((allowedPattern) => allowedPattern.test(text));
    if (!allowed) {
      failures.push(`${rel}: ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error("Boundary audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Boundary audit passed for ${files.length} files.`);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await listFiles(path));
    if (entry.isFile()) out.push(path);
  }
  return out;
}
