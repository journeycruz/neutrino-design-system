# Release Automation Policy

This policy defines how Neutrino packages move from merged code to published artifacts with explicit semver and export-stability guarantees.

## Scope

- Applies to `@neutrino/components` and `@neutrino/tokens`.
- Applies to release workflow automation and release-note requirements.
- Applies to export-surface changes in package entry points.

## Versioning Rules

- All published package versions follow semantic versioning (semver).
- Patch releases are limited to bug fixes and non-breaking behavior corrections.
- Minor releases include additive, backward-compatible API and token changes.
- Major releases are required for breaking API, behavior, token, or export changes.

## Export-Stability Contract

- Public exports in `packages/components/src/index.ts` and package `exports` maps are contract surfaces.
- Export removal, rename, or incompatible type changes are breaking and require a major version.
- Additive exports are allowed in minor versions when existing imports stay valid.
- Release notes must call out export-surface deltas and required migration actions.

## Release Flow

1. CI required checks pass on the release candidate commit.
2. Version impact is classified (patch/minor/major) from semver rules.
3. Release notes include component/token contract impact and migration notes when applicable.
4. Release workflow runs from an explicit trigger and publishes tagged versions.
5. Post-release verification confirms package installability and expected exports.

## Rollback Expectations

- If publish fails before artifacts are visible, fix the workflow and rerun on a new commit.
- If a broken artifact is published, issue a corrective version; do not overwrite published versions.
- Emergency fixes must preserve version history and include explicit release notes.

## Governance Alignment

- PR and release gates are defined in `docs/platform/governance-checklists.md`.
- Architecture and package-boundary contracts are defined in `docs/platform/architecture-contracts.md`.
