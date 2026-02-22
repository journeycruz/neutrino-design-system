import { readFile } from "node:fs/promises";

const requiredFiles = [
  "src/tokens/primitives.json",
  "src/tokens/semantic.json",
  "src/tokens/components.json"
];

const readJson = async (path) => {
  const raw = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  return JSON.parse(raw);
};

const hasDollarValue = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(value, "$value")) {
    return true;
  }

  return Object.values(value).some(hasDollarValue);
};

try {
  const docs = await Promise.all(requiredFiles.map(readJson));

  for (const [index, doc] of docs.entries()) {
    if (!hasDollarValue(doc)) {
      throw new Error(`${requiredFiles[index]} has no DTCG $value tokens.`);
    }
  }

  console.log("Token source files are valid JSON and contain DTCG token values.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
