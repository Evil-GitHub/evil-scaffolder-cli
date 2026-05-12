#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const versionType = process.argv[2] || "patch";
const allowedVersionTypes = new Set(["patch", "minor", "major"]);

if (!allowedVersionTypes.has(versionType)) {
  console.error(
    `Invalid version type "${versionType}". Use patch, minor, or major.`,
  );
  process.exit(1);
}

const run = (command, args, options = {}) => {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

const output = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  return result.stdout.trim();
};

const status = output("git", ["status", "--porcelain"]);
if (status) {
  console.error(
    [
      "Working tree is not clean. Commit or stash your changes before publishing.",
      "",
      status,
    ].join("\n"),
  );
  process.exit(1);
}

const publishArgs = ["publish"];
if (process.env.npm_config_otp) {
  publishArgs.push(`--otp=${process.env.npm_config_otp}`);
}

const npmEnv = {
  ...process.env,
  npm_config_cache:
    process.env.npm_config_cache ||
    path.join(os.tmpdir(), "design-pro-npm-cache"),
};

run("npm", ["whoami"], { env: npmEnv });
run("npm", ["test"], { env: npmEnv });
run("npm", ["pack", "--dry-run"], { env: npmEnv });
run("npm", ["version", versionType]);
run("npm", publishArgs, { env: npmEnv });
run("git", ["push", "--follow-tags"]);

console.log("\nPublished successfully.");
