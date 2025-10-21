# TypeScript 6 Migration Plan

**Status:** Draft (Blocked - awaiting ts-jest compatibility)

**Branch:** chore/ts-migration-6

**Last Updated:** 2025-10-21

## Summary

This document outlines the step-by-step plan to migrate the monorepo to TypeScript 6 when a compatible TypeScript 6.x release and supporting toolchainare available. The goal is to remove the current "baseUrl" deprecation warnings, enable the new compiler options (for example, "ignoreDeprecations"), and ensure the codebase and CI remain green after the migration.

## Why now

- The compiler warns that `baseUrl` will be deprecated and this causes noisy telemetry in CI.
- TypeScript 6 introduces configuration knobs that help manage deprecation migration safely.

## Scope

- All packages in the monorepo (packages/\*).
- Primary targets: tsconfig.base.json, package devDependencies, CI workflows, and test helpers.
- Non-goals: Rewriting large code areas or changing runtime behavior. The migration should only change devDependencies, config, and minimal code fixes required to satisfy the compiler.

## Prerequisites & gating

**Last updated:** 2025-10-21

1. ✅ **Verify a published TypeScript 6 release exists and is available in npm:**

   **STATUS: AVAILABLE** - TypeScript 6.0.0-dev versions are published on npm.
   
   Latest dev version: `6.0.0-dev.20251021`
   
   Check command:
   ```powershell
   npm view typescript versions --json | ConvertFrom-Json | Select-Object -Last 1
   ```

2. ❌ **Check major dev-tool compatibility:** (BLOCKED)

   **ts-jest compatibility:** `"typescript": ">=4.3 <6"` — **BLOCKER**
   - ts-jest explicitly excludes TypeScript 6 in its peerDependencies
   - Must wait for ts-jest update OR migrate to alternative test runner
   
   **ts-node compatibility:** `"typescript": ">=2.7"` — ✅ Compatible
   
   **Other tooling:** Confirm new versions exist that list TypeScript 6 in their peerDependencies.

3. ✅ **Ensure CI runners support the Node.js version needed for the toolchain:**
   
   Current CI uses Node.js 20, which is compatible with TypeScript 6.

## High-level plan

1. Create a feature branch: `chore/ts-migration-6` (this branch)
2. Gate: verify Step 1 (TS6 published) and Step 2 (tool compatibility). If either fails, stop and track the blockers.
3. Bump devDependencies (one-at-a-time or grouped with compatibility checks):
   - typescript@^6
   - ts-jest (or switch to a new test runner that supports TS6)
   - ts-node
   - @types/node (if required)
   - other tooling with TypeScript peer-constraints (lint build plugins).
4. Add the new compiler option to `tsconfig.base.json` to silence the planned deprecation only after TypeScript 6 is installed:

   ```jsonc
   // tsconfig.base.json
   {
     "compilerOptions": {
       // ...existing options...
       "ignoreDeprecations": "6.0",
     },
   }
   ```

   Important: commit this change only after typescript@^6 is installed (the option is not recognized by older compilers).

5. Replace or reduce usage of `baseUrl` where possible:
   - Audit code to find places relying on "baseUrl" behavior (absolute imports that depend on baseUrl)
   - Prefer explicit path mappings in tsconfig or use package imports that map to workspace packages (monorepo-friendly patterns).

6. Run the compiler (noEmit) and the linter; fix all type and lint errors introduced by the new compiler:

   ```powershell
   npx tsc -p tsconfig.base.json --noEmit
   npm run lint
   ```

7. Update Jest config (if using ts-jest) or migrate to compatible test transforms, then run unit & integration tests.

8. Iterate on fixes, ideally in small commits that are easy to review:
   - dependency bumps and CI changes
   - tsconfig change enabling ignoreDeprecations
   - compile fixes and test fixes

9. Once everything passes locally, push the branch and open the PR (use the PR draft body in docs/PR_DRAFT_chore-ts-migration-6.md). Keep the PR as a draft until CI is green.

## CI Changes

The following changes are required to `.github/workflows/ci.yml` to support the TypeScript 6 migration:

### Add TypeScript Compilation Check

Add an explicit step to run TypeScript compilation early in the pipeline so migration failures are discovered quickly:

```yaml
- name: TypeScript compilation check
  run: npx tsc -p tsconfig.base.json --noEmit
```

This step should be added after "Install dependencies" and before "Run unit tests".

### Add Lint Check

Add a lint check step to catch code quality issues:

```yaml
- name: Run lint
  run: npm run lint
```

This step should be added after the TypeScript compilation check.

### Node Version Matrix (if needed)

Current CI uses Node.js 20, which is compatible with TypeScript 6. No changes required at this time, but if TypeScript 6 final release requires a newer Node version, update the matrix:

```yaml
strategy:
  matrix:
    node-version: [20, 22]  # Example if Node 22 becomes required
```

### Recommended CI Step Order

1. Checkout code
2. Set up Node.js
3. Install dependencies
4. Install Playwright browsers
5. **TypeScript compilation check** (NEW)
6. **Run lint** (NEW)
7. Run unit tests
8. Run end-to-end tests

## Compatibility checklist (run before merging)

- [x] typescript@^6 is published and resolvable (6.0.0-dev.20251021 available)
- [x] All required devDependencies have compatible releases (ts-jest BLOCKED - see Prerequisites)
- [ ] CI updated for any Node/toolchain changes
- [ ] `npx tsc -p tsconfig.base.json --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Unit and integration tests pass; coverage thresholds met
- [ ] No new runtime regressions discovered in E2E runs

## Accept criteria

- All CI checks return green.
- Repo compiles cleanly with TypeScript 6 and shows no remaining baseUrl deprecation warnings.
- Lint rules pass (0 errors). Tests (unit, integration, E2E) pass and coverage thresholds are met.

## Rollback plan

If the migration introduces irreconcilable or high-risk regressions, revert the branch or use git to revert the migration commits:

```powershell
git checkout main
git revert <commit-sha>  # or simply close the PR and delete the branch
```

## Owner and timeline

- Owner: @sgbil
- Estimated effort: 1–3 working days (depending on external dependency readiness and the number of type errors requiring manual fixes).

## Notes

- Do not enable `ignoreDeprecations` until you can upgrade to TypeScript 6 — enabling it prematurely breaks the current compiler.
- Keep the migration in small, reviewable commits (dependency bumps first, then config changes, then fixes).
