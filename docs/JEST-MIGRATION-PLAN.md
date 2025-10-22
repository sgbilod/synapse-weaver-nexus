# Jest Transform Migration Plan (ts-jest ➜ babel-jest)

Status: Completed
Date: 2025-10-22
Owner: @sgbil

## Goal

Remove the TypeScript 6 blocker by migrating package test transforms from `ts-jest` to a transpile-only runner (`babel-jest` or `@swc/jest`), while keeping type safety via the separate `npm run type-check` CI job.

## Approach

- Package-by-package migration to avoid a risky all-at-once switch.
- Keep UI and node packages with their own scoped Jest configs.
- Preserve existing mocks, moduleNameMapper, and coverage thresholds per package.

## Rollout

- Phase 1 (done):
  - packages/ui-desktop ➜ `babel-jest` with presets (env, react, typescript)
- Phase 2 (done):
  - packages/nexus-core ➜ `babel-jest` with presets (env, typescript) and testEnvironment: node
- Phase 3 (done):
  - packages/agent-foundry ➜ `babel-jest` (env, typescript) and node env
  - packages/synapse-bridge ➜ `babel-jest` (env, typescript) and node env
- Phase 4 (done):
  - Root `jest.config.ts` migrated to `babel-jest` with a root `babel.config.cjs`
  - Whitelisted ESM-only deps (uuid) via `transformIgnorePatterns`

## Implementation Pattern

- Add `babel.config.cjs` per package:

```js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
```

- Add/update `jest.config.ts` per package:

```ts
import type { Config } from "jest";
import path from "path";

const config: Config = {
  testEnvironment: "node", // or 'jsdom' for UI
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "<rootDir>/coverage",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // drop .js extension in ESM-style imports
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      { configFile: path.join(__dirname, "babel.config.cjs") },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
};

export default config;
```

## CI Strategy

- Keep lint and type-check as separate jobs (already in CI).
- UI coverage job remains dedicated to ui-desktop.
- Optionally add a repo-wide `npm test` job to run all package tests (or add package-specific test jobs) once all packages have a local Jest config.

## Risks & Mitigations

- Transpile-only runners do not perform type-checking: mitigated by `npm run type-check` job.
- ESM import quirks during tests: handled by mapper `^(\\.{1,2}/.*)\\.js$` ➜ `$1`.
- Environment mismatch: use `node` for back-end packages and `jsdom` for UI.

## Acceptance

- All packages use babel-jest (UI uses env+react+ts; back end uses env+ts).
- CI stays green (lint, type-check, tests, coverage thresholds where applicable).
- `ts-jest` removed from devDependencies (root).
