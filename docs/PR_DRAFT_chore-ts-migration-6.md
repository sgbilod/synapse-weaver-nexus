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

- Gate: confirm typescript@^6 is published and the core dev-tools are compatible
- Bump typescript and supporting devDependencies
- Add `ignoreDeprecations` in tsconfig.base.json
- Run full compile + lint + tests, fix issues
- Update CI and merge once green

## Checklist

- [ ] Verified availability of typescript@^6 in npm
- [ ] Verified compatibility across ts-jest, ts-node, and other tooling
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

- Date: 2025-10-21
- Latest TypeScript available on npm: `5.9.3` (TypeScript 6 is not yet published)
- `ts-jest@latest` peerDependencies: `"typescript": ">=4.3 <6"` — this explicitly excludes TypeScript 6 and blocks upgrading while we rely on ts-jest
- `ts-node@latest` peerDependencies: `"typescript": ">=2.7"` — ts-node does not block upgrading

Recommendation
--------------
- Keep this PR in Draft and mark it as blocked until the toolchain (notably ts-jest) publishes a compatible release that supports TypeScript 6.
- Alternatives to unblock earlier:
  - Migrate tests away from ts-jest to a transform that supports TS6 (e.g., a SWC based runner or Vitest), but this is a separate migration with its own risk/effort.
  - Monitor ts-jest releases and prepare a follow-up PR to bump TypeScript once compatibility is confirmed.

