import { type NextRequest, NextResponse } from "next/server";

import { devRedirect } from "@/lib/dev-host";
import { LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/** The dev host sends its pages to www (308); an address without a language gets one (cookie, then Accept-Language, else English). */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const to = devRedirect(request.headers.get("host"), pathname, search, SITE_URL, process.env.APP_DEV_HOST);
  if (to) return NextResponse.redirect(to, 308);
  if (
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  )
    return;
  const chosen = request.cookies.get("NEXT_LOCALE")?.value;
  const first = (request.headers.get("accept-language") ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
  const locale = chosen === "en" || chosen === "fr" ? chosen : first.startsWith("fr") ? "fr" : "en";
  return NextResponse.redirect(new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url));
}

// The dev host must reach the proxy for every path (a literal: the matcher is read statically).
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
    { source: "/:path*", has: [{ type: "host", value: "dev.__PRODUCT__.com" }] },
  ],
};
