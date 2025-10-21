---
name: TypeScript 6 migration
about: Migration PR to upgrade to TypeScript 6 and associated toolchain updates
---

## Summary

This PR upgrades the repository toolchain to TypeScript 6 and contains the minimal configuration and dependency changes required. See `docs/TS6-MIGRATION-PLAN.md` for full context and testing guidance.

## Checklist

- [ ] Verified TypeScript 6 is available in npm and compatible with our tools
- [ ] Bumped devDependencies (typescript, ts-jest/transform, ts-node, etc.)
- [ ] Added `ignoreDeprecations` to `tsconfig.base.json` (after typescript@^6 is installed)
- [ ] Updated CI workflows (Node matrix and explicit tsc step)
- [ ] `npx tsc -p tsconfig.base.json --noEmit` passes
- [ ] `npm run lint` passes
- [ ] All tests pass and coverage thresholds met

## How to test locally

1. Checkout branch
2. Run `npm ci` then `npx tsc -p tsconfig.base.json --noEmit`
3. Run `npm run lint` and the test suite

## Notes for reviewers

- This is a multi-step migration; prefer small changes and iterative reviews.
