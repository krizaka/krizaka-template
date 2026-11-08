import { describe, expect, it } from "vitest";

import { envSchema } from "../lib/env";

const CONTEXTS =
  /^(NEXT_PUBLIC_)?(APP|DATABASE|AUTH|MEDIA|MAIL|PUSH|PAYMENTS|REALTIME|ABUSE|OBSERVABILITY|AI|OPERATOR)_/;
const PLATFORM = new Set(["NODE_ENV"]);

describe("environment variables", () => {
  it("are named by bounded context, never by a product or a vendor", () => {
    for (const key of Object.keys(envSchema.shape)) expect(PLATFORM.has(key) || CONTEXTS.test(key), key).toBe(true);
  });
  it("default to a public, indexed site", () => {
    expect(envSchema.parse({}).APP_SEARCH_INDEXING).toBe("on");
  });
});
