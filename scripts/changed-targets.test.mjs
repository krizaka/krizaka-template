import assert from "node:assert/strict";
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
