export const ACTION_TYPES = Object.freeze([
  "click",
  "type_text",
  "press_key",
  "scroll",
  "wait",
  "open_url",
  "read_file",
  "write_file",
  "list_files",
  "run_command",
  "done"
]);

export const HIGH_RISK_ACTIONS = Object.freeze([
  "write_file",
  "run_command",
  "open_url"
]);

export const actionSchema = Object.freeze({
  type: "object",
  additionalProperties: false,
  required: ["type", "reason"],
  properties: {
    type: { enum: ACTION_TYPES },
    reason: { type: "string", minLength: 1, maxLength: 240 },
    x: { type: "integer", minimum: 0 },
    y: { type: "integer", minimum: 0 },
    text: { type: "string", maxLength: 4000 },
    key: { type: "string", maxLength: 64 },
    direction: { enum: ["up", "down", "left", "right"] },
    amount: { type: "integer", minimum: 1, maximum: 10 },
    url: { type: "string", maxLength: 2048 },
    path: { type: "string", maxLength: 1024 },
    command: { type: "string", maxLength: 1024 },
    args: {
      type: "array",
      maxItems: 12,
      items: { type: "string", maxLength: 256 }
    },
    seconds: { type: "number", minimum: 0, maximum: 10 },
    message: { type: "string", maxLength: 1000 }
  }
});

export const toolSchemas = Object.freeze({
  observeFullScreen: {
    description: "Capture a complete screen observation before and after every action.",
    input: { type: "object", additionalProperties: false, properties: {} }
  },
  planOneAction: {
    description: "Return exactly one candidate action for the current observation.",
    input: {
      type: "object",
      additionalProperties: false,
      required: ["goal", "observation"],
      properties: {
        goal: { type: "string" },
        observation: { type: "object" }
      }
    },
    output: actionSchema
  },
  executeOneAction: {
    description: "Execute one validated action.",
    input: actionSchema
  }
});
