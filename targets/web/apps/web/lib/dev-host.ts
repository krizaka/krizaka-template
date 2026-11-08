/**
 * App Platform routes by prefix or exact match only (no regex), so a spec never lists routes: its ingress is the apex 308 and `/`.
 * What the dev host serves itself is decided here, as tested code (krizaka/.github docs/standards/ci-and-deploy.md).
 */
export const DEV_OPEN = /^\/(api(\/|$)|\.well-known(\/|$)|robots\.txt$)/;

/** Where an address on the dev host goes, or null when the dev host answers it itself. */
export function devRedirect(
  host: string | null,
  pathname: string,
  search: string,
  wwwOrigin: string,
  devHost: string | undefined,
): string | null {
  if (!devHost || host?.split(":")[0] !== devHost || DEV_OPEN.test(pathname)) return null;
  return `${wwwOrigin}${pathname}${search}`;
}
