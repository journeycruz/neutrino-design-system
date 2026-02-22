import { cp } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "tsup", "--config", "tsup.config.ts"], {
  stdio: "inherit",
  cwd: new URL("../", import.meta.url)
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

await cp(new URL("../src/styles/theme.css", import.meta.url), new URL("../dist/theme.css", import.meta.url));
