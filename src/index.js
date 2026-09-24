import { CommunityPPAVController } from "./ppavCommunity.js";
import { createTeachingPlanner } from "./planner.js";
import { createConsoleDriver, LocalWorkspaceDriver } from "./tools.js";
import { createRealtimeApiExample } from "./realtimeApiExample.js";
import { createToolAdapter, definePlugin } from "./pluginSdk.js";
import { toolSchemas } from "./schemas/toolSchemas.js";

export {
  CommunityPPAVController,
  LocalWorkspaceDriver,
  createConsoleDriver,
  createRealtimeApiExample,
  createTeachingPlanner,
  createToolAdapter,
  definePlugin,
  toolSchemas
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const controller = new CommunityPPAVController({
    driver: createConsoleDriver(),
    planner: createTeachingPlanner()
  });
  const result = await controller.run("Run the community PPAV teaching demo.", { maxSteps: 3 });
  console.log(JSON.stringify(result, null, 2));
}
