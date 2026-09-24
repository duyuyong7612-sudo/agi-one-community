# Public Competitor And Adjacent Project Notes

This file records the public projects that should be included when AGI-1 Community
Controller is compared externally. Keep claims tied to reproducible tests.

| Project | Public reference | Notes for comparison |
|---|---|---|
| ByteDance UI-TARS Desktop | https://github.com/bytedance/UI-TARS-desktop | Full desktop GUI agent. Repository advertises Apache-2.0 licensing. |
| Microsoft UFO² | https://github.com/microsoft/UFO | Windows AgentOS with HostAgent/AppAgent patterns and GUI/API automation. Repository advertises MIT licensing. |
| Simular Agent-S | https://github.com/simular-ai/Agent-S | GUI agent research/project using screenshots and accessibility-style state. |
| computer-use-agent | https://github.com/showlab/computer-use-agent | Public computer-use agent pattern centered on screenshot/action loops. |
| screen-use | https://github.com/browser-use/screen-use | Windows desktop action layer from the browser-use ecosystem. |
| Open Interpreter | https://github.com/OpenInterpreter/open-interpreter | Public interpreter project; OS/computer-control workflows should be compared separately from pure GUI agents. |
| Nuphus MCP | https://github.com/nuphus/nuphus-mcp | Tool layer rather than a complete planning brain. Useful for adapter/tool coverage comparison. |
| browser-use | https://github.com/browser-use/browser-use | Browser-focused agent automation; repository advertises MIT licensing. |

## Comparison Rule

Use the same task, same starting state, same model budget, same allowed tools, and a
programmatic checker. Report verified completion separately from model-claimed completion.
