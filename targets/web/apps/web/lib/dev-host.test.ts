import { describe, expect, it } from "vitest";

import { devRedirect } from "./dev-host";

const go = (host: string, path: string, search = "") =>
  devRedirect(host, path, search, "https://www.x.com", "dev.x.com");

describe("the dev host", () => {
  it("sends its pages to www, path and query kept", () => {
    expect(go("dev.x.com", "/fr/account", "?a=1")).toBe("https://www.x.com/fr/account?a=1");
    expect(go("dev.x.com:443", "/")).toBe("https://www.x.com/");
  });
  it("serves its API, /.well-known and robots.txt itself", () => {
    for (const p of ["/api/healthz", "/.well-known/security.txt", "/robots.txt"]) expect(go("dev.x.com", p)).toBeNull();
  });
  it("leaves www alone, and does nothing without a dev host", () => {
    expect(go("www.x.com", "/")).toBeNull();
    expect(devRedirect("dev.x.com", "/", "", "https://www.x.com", undefined)).toBeNull();
  });
});
