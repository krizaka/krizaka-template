import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}`])) },
  }));
}
