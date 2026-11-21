# krizaka-template — agent contract

<!-- krizaka-agents-template v2: rendered from krizaka/.github docs/standards/agents-template.md (scripts/agents-md.mjs). The one AGENTS.md standard: six sections in this order, at most 150 lines, bullets and imperatives. The conformance check « agents-template » reads the headings, the length and CLAUDE.md. Detail goes to docs/ via References, not here. -->

## Project context

- The one template for Krizaka products: `base/` + `targets/{web,desktop,mobile}` + the generator (`bin/krizaka-template.mjs`). Decision: krizaka-internal#2936, licence Apache-2.0 per ADR-031.
- Kind: Node ESM generator (`node >=22`, pnpm) · team: platform · registry entry: [repos.json](https://github.com/krizaka/.github/blob/main/repos.json).
- Read this file first, then the [README](README.md); a generated product reads its own `targets/<target>/AGENTS.md`.
- `CLAUDE.md` is the one line `@AGENTS.md`: never a second copy of it.

## Essential commands

```bash
pnpm install --frozen-lockfile                 # the generator's own dependencies
pnpm run check                                 # prettier --check + generator tests (what CI runs first)
pnpm test                                      # node --test bin/*.test.mjs scripts/*.test.mjs
pnpm run coverage                              # lcov for SonarCloud
pnpm run format                                # prettier --write .
node bin/krizaka-template.mjs list             # the targets
node bin/krizaka-template.mjs new <slug> --target <web|desktop|mobile> [--display "<Product>"] [--dir <parent>]
node bin/krizaka-template.mjs prove <target>   # generate a sample, run the target's declared checks (CI's prove job)
```

- Run `check` on what you changed before every push; a target change also needs `prove <target>`.

## Architecture & conventions

- **Options are data.** A target's behaviour (its checks, its binary extensions, its next steps) lives in `targets/<target>/template.json`. The generator stays target-agnostic; a new target is a folder and its `template.json`, not a branch in the code.
- **Placeholders are one scheme**: `__PRODUCT__` (slug) and `__Product__` (display name), in every target. Prettier turns a standalone `__X__` into `**X**` in markdown prose; `fill` accepts both spellings.
- The name `template.json` is reserved: the generator never copies a file with that name.
- `generate` copies `base/`, then `targets/<target>/` (the target wins a conflict), then fills the placeholders in every file whose extension is not in the target's `binaryExtensions`.
- **A target is a complete project.** What ships in `targets/<target>/` must install, build and pass its checks after generation.
- **Shared things stay shared.** Generated projects call the reusable workflows of `krizaka/.github` (pinned by SHA); the UI is `@krizaka/*` packages. A fix every product needs goes there, not into a target's copy.
- **Each target obeys its own contract**: `targets/<target>/AGENTS.md` is the generated product's agent contract; edit it as what the product's agents will read.
- Follow the [krizaka-engineering skill](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/SKILL.md); search its [packages reference](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/references/packages.md) before writing anything generic.
- Write one job per function: cognitive complexity ≤ 15, nesting ≤ 2, a body under 60 lines; name things by what they do.
- Hierarchy: this root file holds the rules of the whole repository; a sub-folder adds a local `AGENTS.md` that says only what differs there. The nearest file wins.

## Guard-rails & known pitfalls (read before coding)

- The checks are the judge ([ADR-015](https://github.com/krizaka/krizaka-internal/blob/main/docs/adr/.github/ADR-015-ai-code-audit-measured-and-enforced.md), [guards](https://github.com/krizaka/.github/blob/main/docs/standards/guards.md)): never `--no-verify`, never a new `eslint-disable`, never a raised ratchet or baseline.
- Change a target's lockfile together with its manifest, or `--frozen-lockfile` fails the prove job.
- The target name only reaches a path as an entry of the `targets/` listing (`optionsOf`), never as raw input; keep it so.
- `prove` runs on ubuntu for `web` and `mobile`, on macOS for `desktop`; CI proves only the targets a PR touches (`scripts/changed-targets.mjs`), every target on main and in the merge queue.
- Pin every workflow `uses:` by full SHA with the release in a comment; the `Template CI` gate is the required check.
- Start a fix with a failing test; every bug gets its guard.
- Never invent a URL, a price or a figure you did not read; never commit a secret, a capture or a log; no production data in a session, only the dev data.
- Keep the edit hook in `.claude/settings.json` (`npx --yes -p @krizaka/config krizaka-edit-check` on `Edit|Write`).
- No Claude attribution lines anywhere.

## Expected validation workflow

- [ ] `pnpm run check` is green (format and generator tests: `bin/*.test.mjs`, `scripts/*.test.mjs`, which run in seconds).
- [ ] A target change: `node bin/krizaka-template.mjs prove <target>` is green; its lockfile moved with its manifest.
- [ ] A generator change comes with its test; coverage does not drop.
- [ ] README and the target's `AGENTS.md` still say what the code does.
- [ ] One issue, one small PR; merge only with green CI.

## References

- [README](README.md): targets, layout, how to generate.
- [Org standards](https://github.com/krizaka/.github/tree/main/docs/standards) of krizaka/.github; the [engineering charter](https://github.com/krizaka/.github/blob/main/AGENTS.template.md).
- [krizaka-engineering skill](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/SKILL.md).
