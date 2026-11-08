# **Product** — product site

> Generated from [`krizaka/krizaka-template`](https://github.com/krizaka/krizaka-template) (target `web`).

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__&metric=coverage)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__)

A Next.js (App Router) pnpm/turbo monorepo with `apps/web`, wired to everything the family shares. **It only wires**: the
pipeline, deploy tool and UI are the org's reusable workflows and `@krizaka/*` packages, so a fix there reaches every product
without touching this repository.

## First steps after generation

1. `pnpm install && pnpm check` (lint with ast-grep ratchet and i18n check, typecheck, tests) and `pnpm build`.
2. Protect `main` like the org's other repos (PR + required check `Lint · Typecheck · Tests · Build`, squash only).
3. Brand: add the product's tokens to `@krizaka/tokens` and the import in `apps/web/app/globals.css`; marks come from `@krizaka/ui`.
4. Deploy: `deploy/digitalocean/app.yaml` (create the app once, then `krizaka-deploy deploy --apply` — always `--context default`,
   pull main first). Fill `dev-preview.json` honestly; claim the badge only when it is complete.
5. SonarCloud: import the repository at sonarcloud.io so the `SonarCloud Code Analysis` check and the badges above report.

## What is in it (and where the truth stays)

| Piece                            | Here                                                                             | Truth                                        |
| -------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------- |
| CI                               | `.github/workflows/ci.yml` (≈10 lines)                                           | `krizaka/.github` `node-ci.yml`              |
| Dependabot auto-merge, scorecard | thin workflows                                                                   | `krizaka/.github`                            |
| Deploy                           | `.krizaka-deploy.json`, `deploy/digitalocean/app.yaml` (www rule, no route list) | `krizaka-deploy` in `krizaka/.github/deploy` |
| SEO family                       | `scripts/check-seo-family.mjs`                                                   | identical copy, org contract                 |
| Static rules                     | `sgconfig.yml`, `scripts/sg-fix.mjs`, `sg-ratchet.json` (all 0)                  | copies of the org's; keep identical          |
| Env                              | `apps/web/lib/env.ts` (zod, bounded contexts) + test                             | krizaka-com AGENTS §5                        |
| i18n                             | `lib/i18n.ts`, `messages/{en,fr}.json`                                           | `@krizaka/i18n`                              |
| UI                               | `@krizaka/ui`, `tailwind`, `tokens`, `fonts`                                     | published packages                           |
| Dev host / DO routes             | `lib/dev-host.ts`, `proxy.ts` (+ tests)                                          | ADR in `ci-and-deploy.md`                    |
| dev-preview                      | `dev-preview.json` (every criterion a gap)                                       | `docs/standards/dev-preview.md`              |

Not in it, on purpose: a database, auth, mail, maps, mobile — add them from the product that already does it.

<!-- krizaka:workflows:start -->

## Workflows

What runs in the Actions tab of this repository.

- **CI** (`ci.yml`): Lint, tests and build of the repository. Runs on push, on every pull request, in the merge queue.
- **Dependabot auto-merge** (`dependabot-automerge.yml`): Auto-merges safe Dependabot updates. Runs on every pull request.
- **Merge resolution** (`merge-resolution.yml`): Fails a PR that drops what main added without a deletion-explained line. Runs on every pull request.
- **Scorecard** (`scorecard.yml`): OpenSSF Scorecard of the repository. Runs when branch rules change, on a schedule, on demand.
- **Security scan** (`security.yml`): Secret scan (gitleaks) and workflow scan (zizmor); both are required checks. Runs on every pull request, in the merge queue, on push.

<!-- krizaka:workflows:end -->
