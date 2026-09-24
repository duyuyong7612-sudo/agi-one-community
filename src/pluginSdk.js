export function definePlugin(manifest) {
  if (!manifest || typeof manifest !== "object") {
    throw new TypeError("Plugin manifest must be an object.");
  }
  if (!manifest.name || !/^[a-z0-9-]+$/.test(manifest.name)) {
    throw new TypeError("Plugin name must use lowercase letters, numbers, and dashes.");
  }
  const tools = Array.isArray(manifest.tools) ? manifest.tools : [];
  return Object.freeze({
    name: manifest.name,
    version: manifest.version || "0.0.0",
    tools: tools.map((tool) => Object.freeze({ ...tool }))
  });
}

export function createToolAdapter({ name, schema, handler }) {
  if (!name || typeof handler !== "function") {
    throw new TypeError("Tool adapter requires a name and handler.");
  }
  return Object.freeze({
    name,
    schema: schema || { type: "object" },
    async run(input) {
      return handler(input);
    }
  });
}
