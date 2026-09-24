import { ACTION_TYPES, HIGH_RISK_ACTIONS } from "./schemas/toolSchemas.js";

const ALLOWED_KEYS = new Set([
  "Enter",
  "Escape",
  "Tab",
  "Backspace",
  "Delete",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
]);

export class PermissionDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

export function assertSingleAction(action) {
  if (Array.isArray(action)) {
    throw new TypeError("Community PPAV accepts exactly one action, not an array.");
  }
  if (!action || typeof action !== "object") {
    throw new TypeError("Action must be an object.");
  }
}

export function validateAction(action) {
  assertSingleAction(action);
  const keys = Object.keys(action);
  if (!keys.includes("type") || !keys.includes("reason")) {
    throw new TypeError("Action requires type and reason.");
  }
  if (!ACTION_TYPES.includes(action.type)) {
    throw new TypeError(`Unsupported action type: ${String(action.type)}`);
  }
  if (typeof action.reason !== "string" || action.reason.trim().length === 0) {
    throw new TypeError("Action reason must be a non-empty string.");
  }
  if (action.type === "click") {
    requireInteger(action.x, "x");
    requireInteger(action.y, "y");
  }
  if (action.type === "type_text" && typeof action.text !== "string") {
    throw new TypeError("type_text requires text.");
  }
  if (action.type === "press_key" && !ALLOWED_KEYS.has(action.key)) {
    throw new TypeError("press_key requires a safe named key.");
  }
  if (action.type === "scroll") {
    if (!["up", "down", "left", "right"].includes(action.direction)) {
      throw new TypeError("scroll requires a direction.");
    }
    requireInteger(action.amount, "amount");
    if (action.amount < 1 || action.amount > 10) {
      throw new TypeError("scroll amount must be 1..10.");
    }
  }
  if (action.type === "wait") {
    if (typeof action.seconds !== "number" || action.seconds < 0 || action.seconds > 10) {
      throw new TypeError("wait requires seconds between 0 and 10.");
    }
  }
  if (action.type === "run_command") {
    if (typeof action.command !== "string" || !action.command.trim()) {
      throw new TypeError("run_command requires command.");
    }
    if (action.args !== undefined && (!Array.isArray(action.args) || action.args.some((arg) => typeof arg !== "string"))) {
      throw new TypeError("run_command args must be an array of strings.");
    }
  }
  if (["read_file", "write_file", "list_files"].includes(action.type)) {
    if (typeof action.path !== "string" || !action.path.trim()) {
      throw new TypeError(`${action.type} requires path.`);
    }
  }
  return Object.freeze({ ...action });
}

export async function requirePermission(action, permission) {
  if (!HIGH_RISK_ACTIONS.includes(action.type)) {
    return { allowed: true, action };
  }
  const decision = await permission.confirm({
    action,
    message: `Allow ${action.type}?`
  });
  if (!decision || decision.allowed !== true) {
    throw new PermissionDeniedError(`Permission denied for ${action.type}.`);
  }
  return { allowed: true, action };
}

export function createDefaultPermission() {
  return {
    async confirm() {
      return { allowed: false };
    }
  };
}

function requireInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative integer.`);
  }
}
