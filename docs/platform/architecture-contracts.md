# Architecture Contracts

This document defines stable boundaries for the Neutrino design system platform.

## Package Responsibilities

### `@neutrino/components`
- Owns shared UI behavior, accessibility semantics, typed React APIs, and composition patterns.
- Must keep public exports stable through `packages/components/src/index.ts`.
- Must not hardcode brand styling values in component logic.

### `@neutrino/tokens`
- Owns design-token generation and theme artifacts.
- Provides primitive, semantic, component, and theme CSS outputs for downstream consumption.
- Must keep exported token entry points stable unless a semver-major change is announced.

### `@neutrino/storybook`
- Is the primary documentation and interaction verification environment.
- Must represent component API contracts, accessibility usage, and composition guidance.

## Runtime Responsibility Split

### Centralized Logic
- Component behavior, ARIA semantics, keyboard handling, and state transitions are shared and versioned in `@neutrino/components`.
- Components expose predictable, typed props and semantic DOM contracts.

### Distributed Theming
- Visual branding is controlled via token CSS and downstream theme overrides.
- The platform guarantees stable token and state hooks, not a fixed brand language.

## Public Component Contract

Every component should preserve:
- Typed props and ref behavior.
- Semantic HTML and required ARIA attributes for its pattern.
- Stable state hooks (`disabled`, `invalid`, `selected`, etc.) suitable for styling and tests.
- Storybook stories that cover default, interactive, and accessibility-critical states.

## Semver and Export Stability

- Public exports in `packages/components/src/index.ts` and package `exports` fields are contract surfaces.
- Breaking changes include renamed exports, removed props, changed behavior semantics, and token-entry removal.
- Non-breaking additions include new optional props, additive token variables, and new component exports.
- Breaking changes require semver-major release notes and migration guidance.

## Quality Alignment

Contract compliance is enforced through:
- Type checks and unit tests.
- Storybook build and story-based testing.
- Visual regression checks.
- Axe-based accessibility checks.
