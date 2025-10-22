<!--
  PR Draft: chore(ts): migrate to TypeScript 6
  - Use this content as the PR body when opening the draft PR for the migration.
  - See docs/TS6-MIGRATION-PLAN.md for the full migration plan and checklist.
-->

# chore(ts): migrate to TypeScript 6 (draft)

## Summary

This draft PR contains the migration plan and supporting PR template to migrate the repository to TypeScript 6 once the toolchain is available. It does not change any code or dependencies yet — it is a coordination PR and a safe place for reviewers to discuss the migration approach before we perform the dependency updates and config changes.

## Plan

See: docs/TS6-MIGRATION-PLAN.md

## Proposed steps (high level)

- Gate: confirm typescript@^6 is published and the core dev-tools are compatible ✅ (TypeScript available, ts-jest blocks)
- Bump typescript and supporting devDependencies
- Add `ignoreDeprecations` in tsconfig.base.json
- Update CI to add TypeScript compilation and lint checks
- Run full compile + lint + tests, fix issues
- Update CI and merge once green

## Checklist

- [x] Verified availability of typescript@^6 in npm (TypeScript 6.0.0-dev.20251021 available)
- [x] Verified compatibility across ts-jest, ts-node, and other tooling (ts-jest blocks upgrade)
- [ ] CI updated (Node matrix, tsc step)
- [ ] `npx tsc -p tsconfig.base.json --noEmit` passes
- [ ] `npm run lint` passes
- [ ] All tests pass and coverage thresholds met

## How to review

1. Read docs/TS6-MIGRATION-PLAN.md and comment on the approach.
2. If the plan is acceptable, we will follow up with a smaller PR that performs the first change (dependency bump) and iteratively fix issues in child PRs.

## Notes

- This PR is intentionally a draft; do not merge until the gating checks are satisfied.

---

## Gating check results (automated)

**Last updated:** 2025-10-21

### TypeScript 6 Availability & Tool Compatibility

- Date checked: 2025-10-21

- TypeScript availability:
  - Latest stable TypeScript on npm: `5.9.3` (no stable TS6 release yet)
  - Development preview/dev builds for TS6 (e.g. `6.0.0-dev.*`) may be published but are not recommended for production use.

- Tool compatibility highlights:
  - ts-jest (latest) peerDependencies: `"typescript": ">=4.3 <6"` — this explicitly blocks upgrading to TypeScript 6 while we continue to rely on ts-jest for Jest transforms.
  - ts-node (latest) peerDependencies: `"typescript": ">=2.7"` — ts-node does not block upgrading.

## Recommendation

---

Keep this PR in Draft and mark it as blocked until the toolchain (notably ts-jest) publishes a compatible release that supports TypeScript 6. Alternatives to unblock earlier:

1. Migrate tests away from ts-jest to a transform that supports TS6 (e.g., a SWC-based runner or Vitest) — this is a separate migration with its own risk/effort.
2. Use TypeScript 6 dev builds with `ignoreDeprecations` to silence compiler deprecation warnings while acknowledging dev build instability (not recommended for production branches).
3. Monitor ts-jest and other tool releases and prepare a follow-up PR to bump TypeScript once compatibility is confirmed.

---

### Local automated verification (2025-10-21)

I ran focused local checks to validate the repository state after the recent changes (logger centralization, preload/IPC hardening, and lint/type fixes):

- TypeScript compile (local): `npx tsc -p tsconfig.base.json --noEmit` — PASS (no blocking compile errors). NOTE: the compiler still reports the planned deprecation advisory for `baseUrl` in several package `tsconfig.json` files; this is expected until TypeScript 6 is installed or the option `"ignoreDeprecations": "6.0"` is added under a TS6 upgrade.
- ESLint (local): `eslint packages/ --ext .ts,.tsx` — PASS (no production `no-console` or explicit-`any` lint errors in source files; tests are allowed to use `any`).
- Unit tests (logger-only): Jest run for the new logger tests — PASS (4 suites, 10 tests).

Focused coverage (logger files only — `collectCoverageFrom: packages/*/src/logger.ts`):

```text
All files           |    82.5 |       75 |      75 |   80.55
agent-foundry/logger|      80 |    66.66 |   66.66 |   77.77
nexus-core/logger   |      90 |      100 |   83.33 |   88.88
synapse-bridge/logger|     80 |    33.33 |   83.33 |   77.77
ui-desktop/logger   |      80 |      100 |   66.66 |   77.77
```

Notes:

- The coverage run above was intentionally focused on the logger modules to validate the new tests and to increase coverage for the most-critical small modules quickly. Overall package coverage across all code is not yet measured here — further tests will be required across UI components and core logic to reach the 85% coverage target.

- The remaining TypeScript/ESLint issues are primarily the `baseUrl` deprecation advisory lines in individual package tsconfigs (these are not compile errors). The migration remains blocked by `ts-jest`'s peer dependency excluding TS6.

Recommended immediate next steps (short):

1. Continue adding small, focused unit tests for high-impact modules (e.g., `TaskFeed`, `DetailView`, `textUtils`) to raise package-level coverage toward 85%.
2. Keep this PR in Draft and document the `ts-jest` compatibility blocker in the PR description (already included). If you want to unblock earlier, consider a separate migration to a TS6-compatible test transform (SWC/Vitest) — I can draft that plan next.
3. If you'd like, I can push these edits and the new logger tests to the migration branch and update the Draft PR body with the gating-check results above.
