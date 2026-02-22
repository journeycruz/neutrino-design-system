# Validation Commands

These commands capture the deterministic Phase 4 verification path for local and CI usage.

## Key Points
- Run visual and a11y regression checks as separate gates.
- Run keyboard/focus regression and Axe violation scans as separate a11y gates.
- Keep ordering fail-fast so the first failing gate is obvious.
- Use script aliases from `package.json` to avoid ad hoc command drift.

## Minimal Example
```bash
pnpm ci:check
pnpm test:visual
pnpm test:a11y:regression
pnpm test:a11y:axe
pnpm build && pnpm test:consumers
pnpm release:check
```

Reference: https://storybook.js.org/docs
