# Next Steps Guide

Phases 1-10 established production-ready foundations for tokens, APG behaviors, visual regression, CI hardening, FormField composition depth for native and composed controls, export-aware release automation, release-check utility edge-case coverage, and an expanded critical Axe baseline. Iteration 11 extends composition guidance and regression breadth with composed Select coverage, so next work should focus on release failure-path hardening and runtime upgrade safety checks.

## Key Points
- Keep `FormField` composition guidance and coverage stable for native and composed (`Input`/`Select`/`Checkbox`/`Radio`) patterns and guard against regressions, including composed Select metadata merging.
- Keep release-note/export-diff automation and `test:release` utility tests stable for `packages/components/src/index.ts` changes.
- Keep the expanded critical Axe story set stable, including nested dialog and broadened form-control edge stories.
- Expand visual baselines for new APG edge-case stories if styling changes are expected.
- Keep fail-fast command ordering and deterministic scripts as the required merge contract.

## Minimal Example
```txt
Iteration 12: Expand release automation tests for git-history/pathing failure scenarios
Iteration 13: Add deterministic CI coverage for external-storybook/runtime upgrade safety checks
Iteration 14: Add release/consumer smoke checks for package-manager and workspace bootstrap drift
```

Reference: https://dequeuniversity.com/rules/axe/
