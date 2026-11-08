# **Product** — mobile app

> Generated from [`krizaka/krizaka-template`](https://github.com/krizaka/krizaka-template) (target `mobile`).

An Expo (SDK 57) + React Native (0.86) mobile app, wired to everything the Krizaka family shares.
**It only wires**: the pipeline, UI and i18n are the org's reusable workflows and `@krizaka/*` packages,
so a fix there reaches every product without touching this repository.

## First steps after generation

1. `pnpm install && pnpm check` (lint, typecheck, tests).
2. Update `app.json`: set `extra.eas.projectId` after creating the project on expo.dev; replace `owner` with your Expo account.
3. Protect `main` like the org's other repos (PR + required check `Lint · Typecheck · Tests`, squash only).
4. Brand: add product tokens to `@krizaka/tokens` and wire them in `src/ui/Themed.tsx`.

## Running the app

```bash
pnpm install
pnpm start       # Expo dev server (scan with Expo Go or a dev build)
pnpm android     # Run on Android device/emulator
pnpm ios         # Run on iOS simulator
pnpm check       # Lint + typecheck + tests
```

## Workflows

What runs in the Actions tab of this repository.

- **CI** (`ci.yml`): Lint, typecheck and tests. Runs on push, on every pull request, in the merge queue.
- **Dependabot auto-merge** (`dependabot-automerge.yml`): Auto-merges safe Dependabot updates. Runs on every pull request.
- **Scorecard** (`scorecard.yml`): OpenSSF Scorecard of the repository. Runs when branch rules change, on a schedule, on demand.
- **Security scan** (`security.yml`): Secret scan (gitleaks) and workflow scan (zizmor); both are required checks. Runs on every pull request, in the merge queue, on push.
