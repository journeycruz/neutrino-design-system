# Implementation Learnings

Phases 3-6 confirm regression quality is strongest when visual, behavior, and rule-engine accessibility checks are deterministic, script-backed, and enforced in CI. The most reliable path is separating screenshot baselines, keyboard/focus behavior, and Axe scans into distinct fail-fast gates while codifying composition contracts and export-aware release governance.

## Key Points
- Keep visual, keyboard/focus, and Axe gates separate so failures are easier to diagnose and less flaky.
- Storybook story IDs are a stable contract for CI screenshot and keyboard/focus regression coverage.
- APG edge cases need explicit story-backed coverage (`Tabs` with disabled items and nested `Dialog` focus-return).
- Release hardening should run as a first-class gate (`release:check`) alongside quality/build/consumer checks.
- Prefer a curated critical-story set for Axe (`wcag2a`, `wcag2aa`) to keep CI stable while catching high-impact regressions.
- Expanding the critical Axe set is safest when adding high-impact, low-flake static stories incrementally (for example nested dialog, `FormField` valid/composed scenarios, invalid input/select states, disabled radio/select controls, and toast error state).
- Form composition contracts are most stable when `FormField` respects child IDs and merges `aria-describedby` for native `input`/`textarea` usage.
- Composed controls (`Input`/`Select`) should merge incoming `aria-describedby`/`aria-invalid` with their local hint/error semantics so `FormField` metadata does not erase control-level guidance.
- Grouped controls (`Checkbox`/`Radio`) should merge incoming `aria-describedby` with local hint IDs to preserve both field-level and control-level guidance.
- Iteration 11 confirms composed `Select` scenarios should be covered in both critical Axe scans and keyboard/focus regression checks so field-level metadata merges remain stable end to end.
- Release checks are more actionable when they compare public export names across refs and require explicit changeset export notes only when names change.
- Release automation is safer when export-diff parsing and `## Exports` detection are covered by focused utility tests (`pnpm test:release`) in CI.
- Final confidence comes from a full ordered gate run: `ci:check`, visual, a11y regression, axe, build, consumers, release check.

## Minimal Example
```bash
pnpm ci:check
pnpm test:visual
pnpm test:a11y:regression
pnpm test:a11y:axe
pnpm build && pnpm test:consumers
```

Reference: https://playwright.dev/docs/test-assertions
