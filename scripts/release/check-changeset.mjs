import { readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { diffExportNames, formatNames, hasExportsSection } from "./check-changeset-utils.mjs";

const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    return null;
  }
  return result.stdout.trim();
};

const readChangesetFiles = () =>
  readdirSync(".changeset")
    .filter((entry) => entry.endsWith(".md") && entry !== "README.md")
    .map((entry) => ({
      name: entry,
      content: readFileSync(`.changeset/${entry}`, "utf8")
    }));

const isCi = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
if (!isCi) {
  process.stdout.write("release:check skipped outside CI\n");
  process.exit(0);
}

const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main";
const diffRange = `${baseRef}...HEAD`;
const diffOutput = run("git", ["diff", "--name-only", diffRange]);

if (diffOutput === null) {
  process.stderr.write(`release:check failed to diff against ${diffRange}\n`);
  process.exit(1);
}

const changedFiles = diffOutput.split("\n").filter(Boolean);
const affectsPackages = changedFiles.some((file) => file.startsWith("packages/components/") || file.startsWith("packages/tokens/"));

if (!affectsPackages) {
  process.stdout.write("release:check passed (no package changes)\n");
  process.exit(0);
}

const changesets = readChangesetFiles();
const hasChangeset = changesets.length > 0;

if (!hasChangeset) {
  process.stderr.write("release:check failed: package changes detected without a changeset file\n");
  process.exit(1);
}

const componentsIndexPath = "packages/components/src/index.ts";
const componentsExportsChanged = changedFiles.includes(componentsIndexPath);

if (!componentsExportsChanged) {
  process.stdout.write("release:check passed (changeset present, no component export map changes)\n");
  process.exit(0);
}

const baseExportsSource = run("git", ["show", `${baseRef}:${componentsIndexPath}`]);
const headExportsSource = run("git", ["show", `HEAD:${componentsIndexPath}`]);

if (baseExportsSource === null || headExportsSource === null) {
  process.stderr.write("release:check failed: unable to read component export map from git history\n");
  process.exit(1);
}

const { added: addedExports, removed: removedExports, changed: exportsChanged } = diffExportNames(baseExportsSource, headExportsSource);

if (!exportsChanged) {
  process.stdout.write("release:check passed (component index changed, public export names unchanged)\n");
  process.exit(0);
}

const hasExportReleaseNotes = hasExportsSection(changesets);

if (!hasExportReleaseNotes) {
  process.stderr.write("release:check failed: component export changes detected without a `## Exports` changeset section\n");
  process.stderr.write(`added exports: ${formatNames(addedExports)}\n`);
  process.stderr.write(`removed exports: ${formatNames(removedExports)}\n`);
  process.exit(1);
}

process.stdout.write("release:check passed (changeset present with export notes)\n");
process.stdout.write(`added exports: ${formatNames(addedExports)}\n`);
process.stdout.write(`removed exports: ${formatNames(removedExports)}\n`);
process.exit(0);
