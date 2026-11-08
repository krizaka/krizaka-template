# krizaka-template — agent contract

This repository is the one template for Krizaka products: `base/` + `targets/{web,desktop,mobile}` + the generator
(`bin/krizaka-template.mjs`). Decision: krizaka-internal#2936, licence Apache-2.0 per ADR-031.

- **Options are data.** A target's behaviour (its checks, its binary extensions, its next steps) lives in
  `targets/<target>/template.json`. The generator stays target-agnostic; a new target is a folder and its
  `template.json`, not a branch in the code.
- **Placeholders are one scheme**: `__PRODUCT__` (slug) and `__Product__` (display name), in every target. The name
  `template.json` is reserved: the generator never copies a file with that name.
- **A target is a complete project.** What ships in `targets/<target>/` must install, build and pass its checks after
  generation — `node bin/krizaka-template.mjs prove <target>` is the proof, locally and in CI. Change a target's
  lockfile together with its manifest, or `--frozen-lockfile` fails the prove job.
- **Shared things stay shared.** The generated projects call the reusable workflows of `krizaka/.github` (pinned by
  SHA); the UI is `@krizaka/*` packages. A fix that every product needs goes there, not into a target's copy.
- **Each target obeys its own contract**: `targets/<target>/AGENTS.md` is the generated product's agent contract —
  edit it as what the product's agents will read.
- Tests with every change: the generator's (`bin/*.test.mjs`, `scripts/*.test.mjs`) run in seconds; a target change is
  proven by its prove job. No Claude attribution lines anywhere.
