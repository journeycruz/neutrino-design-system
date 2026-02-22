import { spawnSync } from "node:child_process";

const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run("pnpm", ["changeset", "version", "--snapshot", "next"]);
run("pnpm", ["-r", "publish", "--access", "public", "--provenance", "--dry-run", "--no-git-checks"]);
