# **Product** for the Mac

> Generated from [`krizaka/krizaka-template`](https://github.com/krizaka/krizaka-template) (target `desktop`).

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__-desktop&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__-desktop) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__-desktop&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__-desktop) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=krizaka___PRODUCT__-desktop&metric=coverage)](https://sonarcloud.io/summary/new_code?id=krizaka___PRODUCT__-desktop)

A Krizaka **Mac app** (Tauri 2). It only _wires_: what every Mac app does the same way (the folder scope, dropped and watched
files, the Keychain session, the native menu, deep links, the navigation guard, the update channel) is `tauri-plugin-krizaka` of
[`krizaka-desktop`](https://github.com/krizaka/krizaka-desktop) and its typed page side
[`@krizaka/app-desktop`](https://ui.krizaka.com/packages/app-desktop); the session and the API client are
[`@krizaka/app-client`](https://ui.krizaka.com/packages/app-client), as on the phone; the page is built from
[`@krizaka/ui`](https://ui.krizaka.com) (`AppShell desktop`: the web components, in the window), the pipeline is the org's reusable
`tauri-macos.yml`, and the decision is [ADR-005](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-005-tauri-app-kit.md).

## First steps after generation

```bash
pnpm install
pnpm tauri icon src-tauri/icons/source.png      # the product's own mark: use brand/<product>/avatar-1024.png
pnpm check                                       # types, UI tests, Rust tests
pnpm tauri dev
```

| File                               | What it is                                                                                                                                          |
| :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src-tauri/src/lib.rs`             | The plugin with the product's scheme, link hosts and prefixes. Add the product's own commands, each resolving its paths through `app.kit().resolve` |
| `src-tauri/capabilities/main.json` | `core:default`, `krizaka:default`, the title bar's drag and HTTP to the product's own addresses: no `fs`, no shell, no opener                       |
| `src-tauri/Info.plist`             | The deep-link scheme (`CFBundleURLTypes`) and the folder-access sentences                                                                           |
| `src/config.ts`, `src/desktop.ts`  | The wiring: discovery, the Keychain session, the API client; the native side, typed                                                                 |
| `src/menu.ts`, `src/i18n/`         | The native menu bar from the messages (French first, English with the same keys, tested)                                                            |
| `src-tauri/entitlements.plist`     | Hardened runtime, nothing opted out                                                                                                                 |
| `.github/workflows/desktop.yml`    | Calls `tauri-macos.yml`: checks on every PR, the arm64 `.dmg` on a `desktop-v*` tag                                                                 |

## Release and signing

A `desktop-v<version>` tag builds the `.dmg` and attaches it to the release. Until the Developer ID Application certificate and
the notarisation credentials are repository secrets (`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`,
`APPLE_TEAM_ID`, `APPLE_API_ISSUER`, `APPLE_API_KEY`, `APPLE_API_KEY_P8`) the app is not signed: right-click it, then Open. An
unsigned debug build asks for the Keychain password at every launch; that is the missing signature.

<!-- krizaka:workflows:start -->

## Workflows

What runs in the Actions tab of this repository.

- **CI** (`ci.yml`): Lint, tests and build of the repository. Runs on push, on every pull request, in the merge queue.
- **Dependabot auto-merge** (`dependabot-automerge.yml`): Auto-merges safe Dependabot updates. Runs on every pull request.
- **Desktop** (`desktop.yml`): Builds and checks the Mac app; a desktop tag builds the release. Runs on every pull request, on push.
- **Language guards** (`lang-guards.yml`): Rust guards: rustfmt, clippy, cargo-deny, tests. Runs on every pull request, in the merge queue, on push.
- **Scorecard** (`scorecard.yml`): OpenSSF Scorecard of the repository. Runs when branch rules change, on a schedule, on demand.
- **Security scan** (`security.yml`): Secret scan (gitleaks) and workflow scan (zizmor); both are required checks. Runs on every pull request, in the merge queue, on push.

<!-- krizaka:workflows:end -->
