export class ScriptedPlanner {
  constructor(actions) {
    this.actions = [...actions];
  }

  async planOneAction({ goal, observation }) {
    if (!goal || !observation) {
      throw new TypeError("Planner requires a goal and a full-screen observation.");
    }
    return this.actions.shift() || {
      type: "done",
      reason: "No scripted actions remain.",
      message: "Finished."
    };
  }
}

export function createTeachingPlanner() {
  return new ScriptedPlanner([
    {
      type: "wait",
      reason: "Pause so the next observation can be compared with the initial screen.",
      seconds: 0
    },
    {
      type: "done",
      reason: "The demonstration completed one safe step.",
      message: "Community PPAV demo complete."
    }
  ]);
}
