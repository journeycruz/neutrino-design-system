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

## Storybook Publishing

- Storybook is published to GitHub Pages on pushes to `main`.
- Live URL: `https://journeycruz.github.io/neutrino-design-system/`
- Manual deploy is available from Actions via `Publish Storybook` (`workflow_dispatch`).
- Ensure repository Pages is configured to build and deploy from **GitHub Actions**.
