# krizaka-template

One cross-platform Krizaka template. It replaces `krizaka-template-web` and `krizaka-template-desktop` and adds the
mobile target: one shared base (licence, formatting, agent conventions), one folder per platform, one generator.

```bash
node bin/krizaka-template.mjs new myproduct --target web       # or desktop, or mobile
node bin/krizaka-template.mjs list                             # the targets and what they are
```

The generated project installs, builds and passes its checks at once — CI proves it for every target on every change
(`prove` jobs), from a clean checkout:

```bash
node bin/krizaka-template.mjs prove web                        # what CI runs: generate a sample, run its checks
```

## The targets

| Target    | What you get                                                                                                      | Proof runs on |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| `web`     | A product site: Next.js (App Router) in a pnpm/turbo monorepo, org CI, deploy (DigitalOcean), SEO family          | ubuntu        |
| `desktop` | A Mac app: Tauri 2 on [`krizaka-desktop`](https://github.com/krizaka/krizaka-desktop) (ADR-005), signing pipeline | macOS         |
| `mobile`  | A mobile app: Expo + React Native, reduced to a clean skeleton from the Sovkora mobile app                        | ubuntu        |

Why « desktop » and not the shell's name: the target names what you get — a desktop app — exactly like `web` and
`mobile` name a site and a mobile app. The technology behind it (Tauri 2, `krizaka-desktop`) is the target's business.

## How it is laid out

```text
base/                 what every generated project shares: LICENSE, Prettier, the agent settings
targets/<target>/     a complete project, placeholders __PRODUCT__ (slug) and __Product__ (display name)
targets/<target>/template.json   the target's options — data, never code: description, binary extensions,
                      the checks `prove` runs, the next steps `new` prints
bin/krizaka-template.mjs         the generator: copies base/ then the target (target wins), fills placeholders
scripts/changed-targets.mjs      which targets a pull request must prove
```

Options are data: adding or changing a target's behaviour is an edit to its `template.json`, not to the generator.

## Working on the template

```bash
pnpm install
pnpm run check        # format check + generator tests
```

A change lands through a pull request; the `Template CI` gate (generator tests + the touched targets proven),
`Security scan / gitleaks (secrets)` and `Security scan / zizmor (workflows)` are the required checks, and main takes
squash merges only, through the merge queue.

<!-- krizaka:workflows:start -->

## Workflows

What runs in the Actions tab of this repository.

- **CI** (`ci.yml`): Generator tests, then each touched target is generated from a clean checkout and proven (install, build, tests). Runs on push, on every pull request, in the merge queue.
- **Dependabot auto-merge** (`dependabot-automerge.yml`): Auto-merges safe Dependabot updates. Runs on every pull request.
- **Merge resolution** (`merge-resolution.yml`): Fails a PR that drops what main added without a deletion-explained line. Runs on every pull request.
- **Scorecard** (`scorecard.yml`): OpenSSF Scorecard of the repository. Runs when branch rules change, on a schedule, on demand.
- **Security scan** (`security.yml`): Secret scan (gitleaks) and workflow scan (zizmor); both are required checks. Runs on every pull request, in the merge queue, on push.

<!-- krizaka:workflows:end -->
