import test from "node:test";
import assert from "node:assert/strict";
import { diffExportNames, extractExportNames, hasExportsSection } from "./check-changeset-utils.mjs";

test("extractExportNames handles type exports and aliases", () => {
  const source = `
export { Button, type ButtonProps, type ButtonVariant } from "./Button";
export {
  Input as TextInput,
  type InputProps as TextInputProps
} from "./Input";
`;

  const names = [...extractExportNames(source)].sort();
  assert.deepEqual(names, ["Button", "ButtonProps", "ButtonVariant", "TextInput", "TextInputProps"]);
});

test("diffExportNames ignores reorder-only changes", () => {
  const baseSource = `
export { Button, type ButtonProps } from "./Button";
export { Input, type InputProps } from "./Input";
`;
  const headSource = `
export { Input, type InputProps } from "./Input";
export { type ButtonProps, Button } from "./Button";
`;

  const result = diffExportNames(baseSource, headSource);
  assert.equal(result.changed, false);
  assert.deepEqual(result.added, []);
  assert.deepEqual(result.removed, []);
});

test("diffExportNames reports added and removed exports", () => {
  const baseSource = `
export { Button, Input } from "./controls";
`;
  const headSource = `
export { Button, Select, Checkbox } from "./controls";
`;

  const result = diffExportNames(baseSource, headSource);
  assert.equal(result.changed, true);
  assert.deepEqual(result.added, ["Checkbox", "Select"]);
  assert.deepEqual(result.removed, ["Input"]);
});

test("hasExportsSection matches heading case-insensitively", () => {
  const changesets = [
    { content: "## Summary\nSome release notes" },
    { content: "## exports\n- Added `Checkbox`" }
  ];

  assert.equal(hasExportsSection(changesets), true);
});

test("hasExportsSection returns false when section missing", () => {
  const changesets = [{ content: "## Summary\nNo export section here" }];
  assert.equal(hasExportsSection(changesets), false);
});
