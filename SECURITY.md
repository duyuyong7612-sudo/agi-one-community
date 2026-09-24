# Security Policy

Report vulnerabilities privately to the AGI-1 maintainers before public disclosure.

## Sensitive Areas

- Desktop input execution.
- Terminal command execution.
- File write actions.
- Browser navigation.
- Plugin adapters.
- Any handling of tokens or short-lived realtime credentials.

## Default Safety Model

The community controller validates every action and asks for confirmation before sensitive
actions such as file writes, command execution, and browser navigation. Integrators should
show clear user-facing confirmation UI before granting these actions.

Never put production API keys, AGI-1 cloud routes, private prompts, billing secrets, or
commercial service credentials in this repository.
