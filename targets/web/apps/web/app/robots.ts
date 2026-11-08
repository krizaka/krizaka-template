import type { MetadataRoute } from "next";

import { readEnv } from "@/lib/env";
import { CRAWLERS } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const env = readEnv();
  return env.APP_SEARCH_INDEXING === "off"
    ? { rules: { userAgent: "*", disallow: "/" } }
    : {
        rules: [{ userAgent: "*", allow: "/" }, ...CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))],
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
