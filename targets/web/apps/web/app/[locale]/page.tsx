import { Page } from "@krizaka/ui/page";

import { getDictionary, type Locale } from "@/lib/i18n";
import { siteJsonLd } from "@/lib/seo";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return (
    <Page className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(locale)) }} />
      <h1 className="text-4xl">{t.home.title}</h1>
      <p className="mt-4 text-fg-muted">{t.home.lead}</p>
    </Page>
  );
}
