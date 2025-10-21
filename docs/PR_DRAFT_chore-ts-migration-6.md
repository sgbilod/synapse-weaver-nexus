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

### TypeScript 6 Availability ✅

- **TypeScript 6.0.0-dev versions ARE available on npm**
- Latest dev version: `6.0.0-dev.20251021`
- Status: Development versions published and accessible

### Tool Compatibility Status

#### ts-jest ❌ (BLOCKER)
- Current peerDependencies: `"typescript": ">=4.3 <6"`
- **This explicitly excludes TypeScript 6 and blocks upgrading while we rely on ts-jest**
- Status: Awaiting ts-jest update to support TypeScript 6

#### ts-node ✅
- Current peerDependencies: `"typescript": ">=2.7"`
- **ts-node does NOT block upgrading**
- Status: Compatible

### Recommendation

**Keep this PR in Draft** and mark it as blocked until the toolchain (notably ts-jest) publishes a compatible release that supports TypeScript 6.

### Alternatives to unblock earlier:

1. **Migrate tests away from ts-jest** to a transform that supports TS6 (e.g., SWC-based runner, Vitest, or ESBuild-based transforms)
   - This is a separate migration with its own risk/effort
   - Would require comprehensive testing migration

2. **Use TypeScript 6.0.0-dev with ignoreDeprecations**
   - Install `typescript@6.0.0-dev.20251021` (or latest dev version)
   - Use `ignoreDeprecations: "6.0"` in tsconfig to suppress warnings
   - Note: Dev versions may have instabilities

3. **Monitor ts-jest releases** and prepare a follow-up PR to bump TypeScript once compatibility is confirmed
   - Recommended approach for production stability
   - Track: https://github.com/kulshekhar/ts-jest/issues

