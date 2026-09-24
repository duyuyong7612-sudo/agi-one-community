import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

import {
  CommunityPPAVController,
  LocalWorkspaceDriver,
  createConsoleDriver
} from "../src/index.js";
import { validateAction } from "../src/safety.js";
import { ScriptedPlanner } from "../src/planner.js";

test("controller observes before and after each single action", async () => {
  const driver = createConsoleDriver();
  const controller = new CommunityPPAVController({
    driver,
    planner: new ScriptedPlanner([
      { type: "wait", reason: "safe pause", seconds: 0 },
      { type: "done", reason: "finish", message: "ok" }
    ])
  });

  const result = await controller.run("demo", { maxSteps: 3 });

  assert.equal(result.status, "done");
  assert.equal(result.checkpoints.length, 2);
  assert.deepEqual(
    driver.events.map((event) => event.kind),
    ["observe_full_screen", "execute", "observe_full_screen", "observe_full_screen", "execute", "observe_full_screen"]
  );
});

test("planner cannot return a batch of actions", async () => {
  assert.throws(
    () => validateAction([{ type: "wait", reason: "bad", seconds: 0 }]),
    /exactly one action/
  );
});

test("sensitive actions require permission", async () => {
  const driver = createConsoleDriver();
  const controller = new CommunityPPAVController({
    driver,
    planner: new ScriptedPlanner([
      { type: "run_command", reason: "needs approval", command: "node", args: ["--version"] }
    ])
  });

  await assert.rejects(() => controller.run("run command"), /Permission denied/);
});

test("local workspace driver lists, reads, writes, and runs commands inside root", async () => {
  const root = await mkdtemp(join(tmpdir(), "agi1-community-"));
  await mkdir(join(root, "notes"));
  const driver = new LocalWorkspaceDriver({ root });
  const permission = { async confirm() { return { allowed: true }; } };
  const controller = new CommunityPPAVController({
    driver,
    permission,
    planner: new ScriptedPlanner([
      { type: "write_file", reason: "create file", path: "notes/a.txt", text: "hello" },
      { type: "read_file", reason: "read file", path: "notes/a.txt" },
      { type: "list_files", reason: "list dir", path: "notes" },
      { type: "run_command", reason: "run node", command: process.execPath, args: ["--version"] },
      { type: "done", reason: "finish", message: "complete" }
    ])
  });

  const result = await controller.run("use tools", { maxSteps: 8 });
  const text = await readFile(join(root, "notes/a.txt"), "utf8");

  assert.equal(result.status, "done");
  assert.equal(text, "hello");
  assert.equal(result.checkpoints.length, 5);
});

test("local workspace driver blocks path escape", async () => {
  const root = await mkdtemp(join(tmpdir(), "agi1-community-"));
  const driver = new LocalWorkspaceDriver({ root });

  await assert.rejects(
    () => driver.execute({ type: "read_file", reason: "escape", path: "../outside.txt" }),
    /escapes/
  );
});
