# Next Steps Guide

Phases 1-8 established production-ready foundations for tokens, APG behaviors, visual regression, CI hardening, FormField composition depth for native and composed controls, export-aware release automation, and expanded critical Axe story coverage. Next work should focus on release-automation edge-case hardening and further critical Axe expansion.

## Key Points
- Keep `FormField` composition guidance and coverage stable for native and composed (`Input`/`Select`/`Checkbox`/`Radio`) patterns and guard against regressions.
- Keep release-note/export-diff automation stable for `packages/components/src/index.ts` changes.
- Keep the expanded critical Axe story set stable, including nested dialog and form-control edge stories.
- Expand visual baselines for new APG edge-case stories if styling changes are expected.
- Keep fail-fast command ordering and deterministic scripts as the required merge contract.

## Minimal Example
```txt
Iteration 9: Harden release automation with export-diff edge-case tests
Iteration 10: Extend Axe critical set to additional high-impact stories while preserving CI stability
Iteration 11: Expand composition guidance docs and regression breadth for additional high-impact controls
```

Reference: https://dequeuniversity.com/rules/axe/
