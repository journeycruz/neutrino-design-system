# Status Checklist

Use this quick checklist to evaluate post-Phase-8 readiness and remaining release work.

## Key Points
- Confirm full deterministic gate run passes: `ci:check`, `test:visual`, `test:a11y:regression`, `test:a11y:axe`, `build`, `test:consumers`, `release:check`.
- Keep CI enforcing `release:check` and visual regression workflow artifact capture on failures.
- Verify component package remains export-map safe for both `import` and `require` consumers.
- Confirm export-name diffs from `packages/components/src/index.ts` require a `.changeset` entry with a `## Exports` section.
- Confirm release utility tests (`pnpm test:release`) cover export-diff edge cases and run in CI/release workflows.
- Maintain Storybook interaction coverage for critical keyboard/focus flows including disabled Tabs and nested Dialog behavior.
- Confirm expanded critical Axe stories remain green (`Dialog` nested static, `FormField` valid/native textarea/composed controls including composed Select, `Input` invalid, `Select` invalid/disabled, disabled `Checkbox`/`Radio`/`Switch`, `Toast` error).
- Confirm `FormField` composition coverage for native `input` and `textarea` patterns remains green.
- Confirm composed control metadata merging remains green (`FormField` + `Input`/`Select` and grouped `Checkbox`/`Radio` keep external and local `aria-describedby` references).
- Confirm keyboard/focus a11y regression coverage includes composed Select field/control `aria-describedby` merge behavior.

## Minimal Example
```bash
pnpm ci:check
pnpm test:visual
pnpm test:a11y:regression
pnpm test:a11y:axe
pnpm build && pnpm test:consumers
```

Reference: https://github.com/changesets/changesets
