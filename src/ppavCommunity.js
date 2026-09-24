import { createDefaultPermission, requirePermission, validateAction } from "./safety.js";

export class CommunityPPAVController {
  constructor({ driver, planner, permission = createDefaultPermission(), resultChecker = basicResultCheck } = {}) {
    if (!driver || typeof driver.observeFullScreen !== "function" || typeof driver.execute !== "function") {
      throw new TypeError("driver must provide observeFullScreen() and execute(action).");
    }
    if (!planner || typeof planner.planOneAction !== "function") {
      throw new TypeError("planner must provide planOneAction(input).");
    }
    this.driver = driver;
    this.planner = planner;
    this.permission = permission;
    this.resultChecker = resultChecker;
  }

  async run(goal, { maxSteps = 12 } = {}) {
    const checkpoints = [];
    for (let step = 1; step <= maxSteps; step += 1) {
      const before = await this.driver.observeFullScreen();
      const planned = await this.planner.planOneAction({ goal, observation: before, step });
      const action = validateAction(planned);
      await requirePermission(action, this.permission);
      const execution = await this.driver.execute(action);
      const after = await this.driver.observeFullScreen();
      const check = await this.resultChecker({ goal, step, action, before, after, execution });
      const checkpoint = Object.freeze({ step, before, action, execution, after, check });
      checkpoints.push(checkpoint);
      if (action.type === "done") {
        return {
          status: "done",
          summary: action.message || "Done.",
          checkpoints
        };
      }
      if (!check.ok) {
        return {
          status: "needs_review",
          summary: check.message,
          checkpoints
        };
      }
    }
    return {
      status: "max_steps",
      summary: `Stopped after ${maxSteps} community-control steps.`,
      checkpoints
    };
  }
}

export async function basicResultCheck({ action, after }) {
  if (!after || after.mode !== "full_screen") {
    return { ok: false, message: "Post-action observation was not a full-screen capture." };
  }
  return {
    ok: true,
    message: `Observed screen after ${action.type}.`
  };
}
