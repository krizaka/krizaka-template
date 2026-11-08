import { defineConfig } from "vitest/config";

// The repository's own scripts (the SEO family guard, the ratchet). The apps run their own suites (turbo run test); the template's
// own tests (init, drift) run with node:test and leave the product when `init` removes them.
export default defineConfig({
  test: {
    include: ["scripts/**/*.test.mjs"],
    exclude: ["scripts/init.test.mjs", "scripts/check-template-drift.test.mjs"],
  },
});
