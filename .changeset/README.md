# Changesets

Use Changesets to record package changes and semantic version intent.

Workflow:
1. Run `pnpm changeset` when you modify `@neutrino/tokens` or `@neutrino/components`.
2. Commit generated files in `.changeset/`.
3. CI runs `pnpm release:check` and fails package-impacting PRs without a changeset.
4. Use `pnpm release:dry-run` to preview versioning and publish output before merge.
5. Release workflow opens version PRs and publishes when merged.
