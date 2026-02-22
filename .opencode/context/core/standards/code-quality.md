# Code Quality Standard

Follow these baseline rules before merging or releasing changes.

## Key Points
- Keep modules small and focused; prefer pure helpers for token transforms.
- Preserve TypeScript strictness and explicit public exports.
- Add tests for behavior changes and keep scripts deterministic.
- Validate package outputs for both `import` and `require` consumers.
- Run workspace quality gates before handoff.

## Minimal Example
```bash
pnpm ci:check
pnpm build
pnpm test:consumers
```

Reference: https://testing-library.com/docs/
