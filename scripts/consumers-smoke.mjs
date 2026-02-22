import { createRequire } from "node:module";

const tokenEsm = await import("@neutrino/tokens");
if (!tokenEsm.tokens) {
  throw new Error("ESM import failed for @neutrino/tokens");
}

const require = createRequire(import.meta.url);
const tokenCjs = require("@neutrino/tokens");
if (!tokenCjs.tokens) {
  throw new Error("CJS require failed for @neutrino/tokens");
}

const componentEsm = await import("@neutrino/components");
if (!componentEsm.Button || !componentEsm.Input) {
  throw new Error("ESM import failed for @neutrino/components");
}

const componentCjs = require("@neutrino/components");
if (!componentCjs.Button || !componentCjs.Input) {
  throw new Error("CJS require failed for @neutrino/components");
}

console.log("Consumer smoke checks passed for ESM and CJS.");
