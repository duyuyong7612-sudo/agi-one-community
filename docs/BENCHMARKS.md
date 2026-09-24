# Reproducible Benchmark Plan

The community benchmark is designed to compare transparent desktop-control systems without
assuming AGI-1 Community Controller is unique or superior.

## Task Groups

1. File tasks: create, edit, summarize, and verify files inside a temporary workspace.
2. Terminal tasks: run safe commands, interpret exit codes, and repair simple command mistakes.
3. Browser tasks: open public pages, extract visible facts, and submit local test forms.
4. Desktop tasks: click, type, scroll, and verify visible state with screenshots.
5. Mixed tasks: use browser plus file or terminal steps with a final checker.

## Required Artifacts

- `tasks.jsonl`: one task per line with goal, setup, permissions, timeout, and checker.
- `trace.jsonl`: full-screen observation markers, planned action, validation result,
  permission decision, execution result, post-action observation marker, and basic check.
- `summary.json`: pass/fail counts, claimed completion, verified completion, wall time,
  action count, screenshot count, and error categories.

## Fairness Rules

- Run each project with documented install steps.
- Keep model and provider choices explicit.
- Separate browser-only systems from whole-desktop systems.
- Separate tool layers such as Nuphus MCP from full planning agents.
- Report speculative or multi-action modes separately from one-action modes.
- Do not use private AGI-1 prompts, production credentials, private routes, or closed-source
  PPAV optimizations in community benchmark runs.

## Minimal Local Smoke Task

The included tests exercise the one-action invariant, permission checks, local files,
terminal execution, and boundary audit. These are smoke tests, not competitive results.
