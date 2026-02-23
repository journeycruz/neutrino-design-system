import { stat } from "node:fs/promises";
import { join } from "node:path";

const BUDGETS = [
  {
    label: "components dist total",
    path: "packages/components/dist",
    maxBytes: 360_000,
    directory: true
  },
  {
    label: "tokens dist total",
    path: "packages/tokens/dist",
    maxBytes: 340_000,
    directory: true
  },
  {
    label: "components esm entry",
    path: "packages/components/dist/index.js",
    maxBytes: 90_000,
    directory: false
  },
  {
    label: "tokens esm entry",
    path: "packages/tokens/dist/index.js",
    maxBytes: 45_000,
    directory: false
  }
];

async function getDirectorySize(directoryPath) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const sizes = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return getDirectorySize(absolutePath);
      }
      const file = await stat(absolutePath);
      return file.size;
    })
  );
  return sizes.reduce((sum, value) => sum + value, 0);
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function readSize(target) {
  if (target.directory) {
    return getDirectorySize(target.path);
  }
  const file = await stat(target.path);
  return file.size;
}

const results = await Promise.all(
  BUDGETS.map(async (target) => {
    const size = await readSize(target);
    return {
      ...target,
      size,
      pass: size <= target.maxBytes
    };
  })
);

for (const result of results) {
  const state = result.pass ? "PASS" : "FAIL";
  console.log(
    `${state} ${result.label}: ${formatKB(result.size)} (budget ${formatKB(result.maxBytes)})`
  );
}

const failed = results.filter((result) => !result.pass);
if (failed.length > 0) {
  throw new Error(`Bundle budget check failed for ${failed.length} target(s).`);
}
