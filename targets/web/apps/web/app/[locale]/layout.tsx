import "../globals.css";
import "@krizaka/ui/blocks.css";

import { MotionObserver } from "@krizaka/ui/motion";
import { ThemeProvider, ThemeScript } from "@krizaka/ui/theme";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getDictionary, type Locale, LOCALES } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safe: Locale = LOCALES.includes(locale as Locale) ? (locale as Locale) : "en";
  const t = getDictionary(safe);
  return {
    metadataBase: new URL(SITE_URL),
    ...pageMetadata(safe),
    title: { default: t.meta.siteName, template: t.meta.titleTemplate.replace("{title}", "%s") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeScript defaultMode="dark" />
      </head>
      <body className="min-h-screen bg-surface-0 text-fg antialiased">
        <ThemeProvider defaultMode="dark">
          {children}
          <MotionObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
