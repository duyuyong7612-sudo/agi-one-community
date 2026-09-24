import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

export class MemoryScreenDriver {
  constructor(initialScreen = "empty desktop") {
    this.screen = initialScreen;
    this.events = [];
  }

  async observeFullScreen() {
    this.events.push({ kind: "observe_full_screen" });
    return {
      mode: "full_screen",
      text: this.screen,
      timestamp: new Date(0).toISOString()
    };
  }

  async execute(action) {
    this.events.push({ kind: "execute", action });
    switch (action.type) {
      case "click":
        this.screen = `${this.screen}\nclicked:${action.x},${action.y}`;
        break;
      case "type_text":
        this.screen = `${this.screen}\ntyped:${action.text}`;
        break;
      case "press_key":
        this.screen = `${this.screen}\nkey:${action.key}`;
        break;
      case "scroll":
        this.screen = `${this.screen}\nscroll:${action.direction}:${action.amount}`;
        break;
      case "wait":
        this.screen = `${this.screen}\nwaited:${action.seconds}`;
        break;
      case "open_url":
        this.screen = `${this.screen}\nurl:${action.url}`;
        break;
      case "read_file":
        this.screen = `${this.screen}\nread:${action.path}`;
        break;
      case "write_file":
        this.screen = `${this.screen}\nwrote:${action.path}`;
        break;
      case "list_files":
        this.screen = `${this.screen}\nlisted:${action.path}`;
        break;
      case "run_command":
        this.screen = `${this.screen}\ncommand:${action.command}`;
        break;
      case "done":
        this.screen = `${this.screen}\ndone:${action.message || ""}`;
        break;
      default:
        throw new Error(`No executor for ${action.type}`);
    }
    return { ok: true, action };
  }
}

export function createConsoleDriver() {
  return new MemoryScreenDriver("console demo screen");
}

export class LocalWorkspaceDriver {
  constructor({ root = process.cwd(), browser = createBrowserAdapter() } = {}) {
    this.root = resolve(root);
    this.browser = browser;
    this.lastObservation = "workspace ready";
    this.events = [];
  }

  async observeFullScreen() {
    this.events.push({ kind: "observe_full_screen" });
    return {
      mode: "full_screen",
      text: this.lastObservation,
      timestamp: new Date().toISOString()
    };
  }

  async execute(action) {
    this.events.push({ kind: "execute", action });
    if (action.type === "read_file") {
      const path = this.#safePath(action.path);
      const text = await readFile(path, "utf8");
      this.lastObservation = `read_file ${action.path}\n${text.slice(0, 4000)}`;
      return { ok: true, text };
    }
    if (action.type === "write_file") {
      const path = this.#safePath(action.path);
      await writeFile(path, action.text || "", "utf8");
      this.lastObservation = `write_file ${action.path}`;
      return { ok: true };
    }
    if (action.type === "list_files") {
      const path = this.#safePath(action.path);
      const entries = await readdir(path, { withFileTypes: true });
      const names = entries.map((entry) => `${entry.isDirectory() ? "dir " : "file"} ${entry.name}`);
      this.lastObservation = `list_files ${action.path}\n${names.join("\n")}`;
      return { ok: true, entries: names };
    }
    if (action.type === "run_command") {
      const result = await runCommand(action.command, action.args || [], { cwd: this.root });
      this.lastObservation = `run_command ${action.command}\nexit:${result.exitCode}\n${result.stdout}\n${result.stderr}`;
      return { ok: result.exitCode === 0, ...result };
    }
    if (action.type === "open_url") {
      const result = await this.browser.openUrl(action.url);
      this.lastObservation = `open_url ${action.url}\n${result.title || ""}`;
      return { ok: true, ...result };
    }
    if (action.type === "done") {
      this.lastObservation = `done ${action.message || ""}`;
      return { ok: true };
    }
    this.lastObservation = `${action.type} requested. Connect a desktop input adapter to execute GUI events.`;
    return { ok: true, simulated: false };
  }

  #safePath(path) {
    const resolved = resolve(this.root, path);
    if (resolved !== this.root && !resolved.startsWith(`${this.root}/`)) {
      throw new Error("Path escapes the configured workspace root.");
    }
    return resolved;
  }
}

export function createBrowserAdapter() {
  return {
    async openUrl(url) {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http and https URLs are allowed.");
      }
      return { url: parsed.toString(), title: "Browser adapter placeholder" };
    }
  };
}

export function runCommand(command, args, { cwd }) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      resolvePromise({ exitCode: 127, stdout, stderr: `${stderr}${error.message}` });
    });
    child.on("close", (exitCode) => {
      resolvePromise({ exitCode, stdout, stderr });
    });
  });
}
