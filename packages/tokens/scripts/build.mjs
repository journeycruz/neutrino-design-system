import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import StyleDictionary from "style-dictionary";

const require = createRequire(import.meta.url);
const config = require("../style-dictionary.config.cjs");

const styleDictionary = new StyleDictionary(config);

await styleDictionary.cleanAllPlatforms();
await styleDictionary.buildAllPlatforms();

const esmWrapper = 'export { default as tokens } from "./tokens.js";\nexport { default } from "./tokens.js";\n';
const cjsWrapper = '"use strict";\nmodule.exports.tokens = require("./tokens.cjs");\nmodule.exports.default = module.exports.tokens;\n';
const dtsWrapper = 'import tokens from "./tokens.js";\nexport { tokens };\nexport default tokens;\n';

await writeFile(new URL("../dist/index.js", import.meta.url), esmWrapper, "utf8");
await writeFile(new URL("../dist/index.cjs", import.meta.url), cjsWrapper, "utf8");
await writeFile(new URL("../dist/index.d.ts", import.meta.url), dtsWrapper, "utf8");
