# Governance Checklists

Use these checklists as merge and release gates for the design system platform.

## Pull Request Required Checks

- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes for unit/component tests.
- [ ] `pnpm test:coverage:components` passes and enforces minimum coverage thresholds.
- [ ] `pnpm test:storybook` passes.
- [ ] `pnpm storybook:build` passes.
- [ ] `pnpm build` and `pnpm bundle:check` pass bundle-size budgets.
- [ ] `pnpm test:a11y:regression` passes.
- [ ] `pnpm test:a11y:axe` passes.
- [ ] `pnpm test:visual` passes in visual-regression workflow.
- [ ] Any visual diffs are reviewed and accepted when intentional.

## Release Readiness Checks

- [ ] All PR checks are green on the release branch/head commit.
- [ ] Package entry points and exports are validated for `@neutrino/components` and `@neutrino/tokens`.
- [ ] Contract-impacting changes are labeled for semantic versioning.
- [ ] Breaking changes include migration notes in changelog/release notes.
- [ ] Token changes preserve backward compatibility or are called out as major.
- [ ] Manual release workflow `.github/workflows/release.yml` ran with `pnpm release:check` passing.
- [ ] Storybook docs include updated examples for changed public APIs.

## Accessibility and Behavior Guarantees

- [ ] Affected components retain semantic markup and expected ARIA behavior.
- [ ] Keyboard interactions remain test-covered for changed interactive components.
- [ ] Axe scans show no WCAG A/AA violations for critical component stories.

## Performance and Packaging Guardrails

- [ ] New code avoids unnecessary runtime dependencies in shared components.
- [ ] Build output remains tree-shakeable via stable ESM/CJS exports.
- [ ] Cross-package coupling remains explicit and minimal.

## Governance Notes

- PR checks are enforced by `.github/workflows/ci.yml` and `.github/workflows/visual-regression.yml`.
- Release workflow should only publish when required quality checks are satisfied.
- Coverage and bundle budgets are enforced by CI workflow steps, not manual reviewer checks.
- Contributor workflow and migration expectations are defined in `docs/platform/contributor-migration-policy.md`.
