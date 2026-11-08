import { describe, expect, it } from "vitest";

import { GET } from "@/app/llms.txt/route";
import { llmsText } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

describe("llms.txt", () => {
  it("names the site, links its pages and its sitemap, and leads back to Krizaka", () => {
    const text = llmsText();
    expect(text.startsWith("# ")).toBe(true);
    expect(text).toContain(`${SITE_URL}/en`);
    expect(text).toContain(`${SITE_URL}/sitemap.xml`);
    expect(text).toContain("https://www.krizaka.com");
  });
  it("is served as plain text", async () => {
    const res = GET();
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(await res.text()).toBe(llmsText());
  });
});

import robots from "@/app/robots";
import { CRAWLERS, pageMetadata, siteJsonLd } from "@/lib/seo";

describe("the family SEO contract", () => {
  it("robots.txt names every welcomed crawler", () => {
    const rules = robots().rules;
    const agents = (Array.isArray(rules) ? rules : [rules]).map((r) => r.userAgent);
    for (const bot of CRAWLERS) expect(agents).toContain(bot);
  });
  it("every page has a canonical, social cards and a JSON-LD that leads back to Krizaka", () => {
    const meta = pageMetadata("en");
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/en`);
    expect(meta.openGraph?.images).toBeDefined();
    expect(meta.twitter).toBeDefined();
    expect(JSON.stringify(siteJsonLd("en"))).toContain("https://www.krizaka.com/#organization");
  });
});
