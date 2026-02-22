# Common Errors: Monorepo Pathing

Most failures were config path mismatches between repo-root and package-root execution contexts. Fixing path bases resolved test and Storybook type failures quickly.

## Key Points
- Vitest include/setup paths must match package execution root.
- Storybook stories in component package need Storybook types in that package.
- Controlled-component stories often fail strict typing without required args.
- Root scripts importing workspace packages need root-level workspace deps.

## Minimal Example
```txt
Symptom: Cannot find module setup file
Cause: setupFiles path prefixed with packages/components/
Fix: use src/test/setup.ts for package-local execution
```

Reference: https://nodejs.org/api/packages.html
