import assert from "node:assert/strict";
import test from "node:test";

import { ACTION_TYPES } from "../src/schemas/toolSchemas.js";

test("public action schema excludes advanced private action classes", () => {
  assert.equal(ACTION_TYPES.includes(["batch", "actions"].join("_")), false);
  assert.equal(ACTION_TYPES.includes(["parallel", "tool", "calls"].join("_")), false);
  assert.equal(ACTION_TYPES.includes(["diff", "observe"].join("_")), false);
  assert.equal(ACTION_TYPES.includes(["memory", "plan"].join("_")), false);
});
