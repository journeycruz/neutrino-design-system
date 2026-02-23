# Contributor and Migration Policy

This policy defines how contributors propose, review, and communicate platform changes that can affect downstream consumers.

## Contributing Expectations

- Follow required quality gates in `docs/platform/governance-checklists.md` before requesting merge.
- Keep public API changes explicit in code, stories, and release notes.
- For changes that modify contract behavior, update architecture and Storybook contract documentation in the same pull request.

## Migration Policy

- Any breaking change must include migration guidance in PR description and release notes.
- Migration guidance must include old usage, new usage, and risk notes.
- Migrations should prefer additive transitions and deprecation windows when feasible.

## Semver and Contract Impact

- Changes are classified using semver rules from `docs/platform/release-automation-policy.md`.
- Export-surface changes in `@neutrino/components` or `@neutrino/tokens` are contract-impacting and require explicit migration notes.
- Contract definitions and package boundaries are the source of truth in `docs/platform/architecture-contracts.md`.

## Required Cross-Links

- Architecture contracts: `docs/platform/architecture-contracts.md`
- Governance checklists: `docs/platform/governance-checklists.md`
- Release policy: `docs/platform/release-automation-policy.md`
- Storybook contract docs: `apps/storybook/src/contracts/platform-contracts.stories.tsx`
