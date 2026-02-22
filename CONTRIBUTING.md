# Contributing

## Local Setup

1. Enable pnpm with Corepack:
   - `npm install --global corepack@latest`
   - `corepack enable pnpm`
2. Install dependencies: `pnpm install`

## Development Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm storybook`

## Release Flow

1. Add a changeset with `pnpm changeset`.
2. Push your PR and ensure CI is green.
3. Merge to `main` to trigger the release workflow.

## Prerelease Channel

- Enter prerelease mode: `pnpm changeset pre enter next`
- Exit prerelease mode: `pnpm changeset pre exit`
