import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const required = require("@neutrino/tokens");

if (!required?.tokens) {
  throw new Error("CJS require from @neutrino/tokens failed.");
}
