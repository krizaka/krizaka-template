import { z } from "zod";

/**
 * Every environment variable of the app, declared once, named by bounded context (APP_, DATABASE_, AUTH_, MAIL_, MEDIA_, ABUSE_, AI_…)
 * — never by product or vendor: the vendor is a value (`MAIL_PROVIDER=mailgun`). Add yours here; tests/env.test.ts refuses the rest.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** The public origin of the site (canonical URLs, sitemap). */
  APP_PUBLIC_URL: z.string().url().default("https://www.__PRODUCT__.com"),
  /** The development address (`dev.__PRODUCT__.com`): every page goes to www (308); only the API, /.well-known and robots.txt keep serving. Unset: no dev host. */
  APP_DEV_HOST: z.string().optional(),
  /** `off` on every dev / preview deployment: noindex everywhere. */
  APP_SEARCH_INDEXING: z.enum(["on", "off"]).default("on"),
});

export type Env = z.infer<typeof envSchema>;
export const readEnv = (source: Record<string, string | undefined> = process.env): Env => envSchema.parse(source);
