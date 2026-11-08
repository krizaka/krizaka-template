#!/usr/bin/env node
// Decides which targets CI must prove, from the files a pull request changed.
// Prints one `<target>=true|false` line per target, for $GITHUB_OUTPUT.
// Anything outside targets/<t>/ (the base, the generator, the workflows) concerns every target.
import { execFileSync } from "node:child_process";

import { targets } from "../bin/krizaka-template.mjs";

export function changedTargets(all, changedFiles) {
  const flags = Object.fromEntries(all.map((t) => [t, false]));
  for (const file of changedFiles) {
    const match = /^targets\/([^/]+)\//.exec(file);
    if (match && match[1] in flags) flags[match[1]] = true;
    else return Object.fromEntries(all.map((t) => [t, true]));
  }
  return flags;
}

function main() {
  const all = targets();
  const base = process.env.BASE_SHA;
  const flags =
    process.env.GITHUB_EVENT_NAME === "pull_request" && base
      ? changedTargets(
          all,
          execFileSync("git", ["diff", "--name-only", base, "HEAD"], { encoding: "utf8" }).split("\n").filter(Boolean),
        )
      : Object.fromEntries(all.map((t) => [t, true]));
  for (const [target, run] of Object.entries(flags)) console.log(`${target}=${run}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();
