import { tokens } from "@neutrino/tokens";

if (!tokens || typeof tokens !== "object") {
  throw new Error("ESM import from @neutrino/tokens failed.");
}
