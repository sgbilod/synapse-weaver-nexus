# UI Desktop - Command Deck

This package contains the Electron + React Command Deck used to interact
with the Synapse Weaver Nexus orchestration engine.

## Overview

The Command Deck is a three-panel interface:

- State Monitor (left)
- Task Feed (center)
- Detail View (right)

Key components live in `src/renderer/components` and are implemented with
TypeScript and React.

## Public Components

- `TaskInput` - primary input for dispatching tasks to the Nexus Core.
- `TaskFeed` - activity stream showing system events.
- `StateMonitor` - displays learned personal enclave and agent credibility.
- `DetailView` - inspection panel for selected events; renders generated code.
- `CodeDisplay` - syntax-highlighted code renderer for agent output.

## Preload API (nexusApi)

The frontend communicates with the Nexus Core via a secure preload bridge
exposed as `window.nexusApi`. The interface is defined in `src/preload.cts`.

Important methods:

- `getInitialState(): Promise<NexusState>` - fetch initial application state.
- `submitTask(task: string): Promise<void>` - submit a human-readable task.
- `onStateUpdate(callback: (state: NexusState) => void): void` - register
  for real-time updates.

Security: The preload layer performs input sanitization and length checks on
task submissions. The UI `TaskInput` performs additional client-side
sanitization and basic rate-limiting to reduce risk of accidental abuse.

## Running Tests

Unit tests use Jest + React Testing Library. From the repository root:

```pwsh
npm install
npm test --workspace=packages/ui-desktop
```

E2E tests use Playwright and are located in `packages/ui-desktop/tests`.

## Development

- Start preload compiler and Vite dev server:

```pwsh
npm run dev --workspace=packages/ui-desktop
```

## Security Notes

- All text inputs are sanitized before being sent across IPC channels.
- The preload script restricts what gets forwarded to the main process and
  performs length limits to prevent large payloads.
- No user-provided content is injected as HTML into the DOM.
