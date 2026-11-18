import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { changedTargets } from "./changed-targets.mjs";

const ALL = ["web", "desktop", "mobile"];

test("a change inside one target proves only that target", () => {
  assert.deepEqual(changedTargets(ALL, ["targets/web/README.md", "targets/web/package.json"]), {
    web: true,
    desktop: false,
    mobile: false,
  });
});

test("a change outside targets/ proves every target", () => {
  assert.deepEqual(changedTargets(ALL, ["targets/web/README.md", "bin/krizaka-template.mjs"]), {
    web: true,
    desktop: true,
    mobile: true,
  });
  assert.deepEqual(changedTargets(ALL, ["base/LICENSE"]), { web: true, desktop: true, mobile: true });
});

test("no change proves nothing", () => {
  assert.deepEqual(changedTargets(ALL, []), { web: false, desktop: false, mobile: false });
});

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "changed-targets.mjs");
const lines = (env) => {
  const result = spawnSync(process.execPath, [SCRIPT], {
    encoding: "utf8",
    env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split("\n").sort();
};

test("outside a pull request every target is proven", () => {
  assert.deepEqual(lines({}), ["desktop=true", "mobile=true", "web=true"]);
});

test("a pull request whose head is its base changes nothing and proves nothing", () => {
  assert.deepEqual(lines({ GITHUB_EVENT_NAME: "pull_request", BASE_SHA: "HEAD" }), [
    "desktop=false",
    "mobile=false",
    "web=false",
  ]);
});
