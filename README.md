# AGI-1 Community Controller

AGI-1 Community Controller is the first public community edition from the AGI-1 project.
It is a runnable, transparent, step-by-step desktop-control controller for learning,
research, extension, and practical local automation.

The controller is intentionally simple in its execution contract:

1. Capture a full-screen observation.
2. Ask the planner for exactly one action.
3. Validate the action against the public schema.
4. Ask for user permission when the action is sensitive.
5. Execute that one action.
6. Capture the full screen again.
7. Run a basic result check before moving to the next step.

This loop is a public, common pattern across open desktop agents. It is not presented as
unique to AGI-1. The community edition focuses on being understandable, reproducible,
and extensible while still useful for real multi-step local tasks.

## What Is Included

- Basic realtime voice API connection example using standard short-lived tokens.
- Real workspace file tools: list, read, and write within a configured root.
- Real terminal tool execution using argv-based process spawning.
- Browser adapter interface with a safe default URL opener.
- Public tool schemas for one-action desktop control.
- Safety confirmation hooks for sensitive actions.
- Step-by-step PPAV community controller with full-screen observations around every action.
- Plugin SDK for adding public tool adapters.
- Node test suite and boundary audit.
- Reproducible benchmark plan for comparing against other public projects.

## What Remains Closed

AGI-1 commercial cloud service continues to keep these production systems private:

- Full three-stage realtime voice state machine.
- Voiceprint gating and optimized hard interruption.
- Realtime voice / three-stage voice / PPAV hybrid routing.
- Fast direct execution paths.
- Multi-action batch chains.
- Low-screenshot and differential-observation optimization.
- Context compression.
- Core brain prompts.
- Complex failure repair strategies.
- Production verification ledger.
- Memory-enhanced planning.
- Cloud billing, production keys, hosted orchestration, and commercial assets.

The commercial AGI-1 service is positioned around speed, success rate, lower execution
cost, and a complete realtime voice experience. Use the community controller when you
want a transparent local foundation. Use the AGI-1 cloud service when you need high
success rate, low latency, full-duplex voice, batch execution, and advanced PPAV.

## Quick Start

```bash
cd open-source-edition
npm test
npm run audit
npm run demo
```

Programmatic usage:

```js
import {
  CommunityPPAVController,
  LocalWorkspaceDriver,
  createTeachingPlanner
} from "@agi-1/community-controller";

const controller = new CommunityPPAVController({
  driver: new LocalWorkspaceDriver({ root: process.cwd() }),
  planner: createTeachingPlanner()
});

const result = await controller.run("Inspect this workspace.", { maxSteps: 12 });
console.log(result.status);
```

## Competitive Matrix

The community edition should be compared with reproducible tasks, not marketing claims.

| Project | Scope | Public license / status | Fair comparison notes |
|---|---|---|---|
| ByteDance UI-TARS Desktop | Cross-platform visual GUI agent | Apache-2.0 | Compare desktop task pass rate, observation/action trace, latency, and setup cost. |
| Microsoft UFO² | Windows AgentOS with HostAgent/AppAgent, GUI + API | MIT | Compare Windows app tasks, API-assisted control, and public speculative multi-action modes separately from one-step mode. |
| Simular Agent-S | Screenshot + Accessibility GUI agent | Public research/project | Compare cross-platform GUI tasks and accessibility-assisted observations. |
| computer-use-agent | Screenshot/action loop agent | Public project | Compare same screenshot/action tasks and final-state checkers. |
| screen-use | Windows desktop action layer | Public project | Compare action-layer coverage and Windows task execution. |
| Open Interpreter OS profile | Code execution + PyAutoGUI style computer control | Public project | Compare coding-terminal tasks and GUI tasks separately. |
| Nuphus MCP | Tool layer, not a complete desktop brain | Public project | Compare tool coverage and adapter ergonomics, not end-to-end agent planning alone. |
| browser-use | Browser automation | MIT | Compare browser-only tasks, DOM/control reliability, and repeatability. |

Baseline public references are listed in [docs/COMPETITORS.md](docs/COMPETITORS.md).

## Benchmark Policy

See [docs/BENCHMARKS.md](docs/BENCHMARKS.md). Any public comparison must include:

- Exact task list and starting state.
- Tool permissions granted.
- Model/provider and version.
- Hardware/OS/browser versions.
- Raw traces or enough logs to reproduce.
- Programmatic final-state checkers.
- Separate reporting for claimed completion and verified completion.

Do not claim leadership from anecdotal demos. Do not claim the basic screenshot/action
loop is unique.

## Boundary Audit

```bash
npm run verify
```

The audit checks that this directory does not contain production secrets, private URLs,
closed-source module references, three-stage voice implementation terms, or advanced
PPAV module names.

## License

AGPL-3.0-or-later. See [LICENSE](LICENSE). Commercial/closed-source use requires a separate commercial license — contact the maintainer.
