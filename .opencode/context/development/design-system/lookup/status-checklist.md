# Status Checklist

Use this quick checklist to evaluate post-Phase-8 readiness and remaining release work.

## Key Points
- Confirm full deterministic gate run passes: `ci:check`, `test:visual`, `test:a11y:regression`, `test:a11y:axe`, `build`, `test:consumers`, `release:check`.
- Keep CI enforcing `release:check` and visual regression workflow artifact capture on failures.
- Verify component package remains export-map safe for both `import` and `require` consumers.
- Confirm export-name diffs from `packages/components/src/index.ts` require a `.changeset` entry with a `## Exports` section.
- Maintain Storybook interaction coverage for critical keyboard/focus flows including disabled Tabs and nested Dialog behavior.
- Confirm expanded critical Axe stories remain green (`Dialog` nested static, `FormField` native textarea, `Select` invalid, disabled `Checkbox`/`Switch`).
- Confirm `FormField` composition coverage for native `input` and `textarea` patterns remains green.
- Confirm composed control metadata merging remains green (`FormField` + `Input`/`Select` and grouped `Checkbox`/`Radio` keep external and local `aria-describedby` references).

## Minimal Example
```bash
pnpm ci:check
pnpm test:visual
pnpm test:a11y:regression
pnpm test:a11y:axe
pnpm build && pnpm test:consumers
```

Reference: https://github.com/changesets/changesets
