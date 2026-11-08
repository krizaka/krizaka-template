/** Addresses of the site — structure, not words (the words are in messages/). */
// normalised like a URL (host in lower case): the placeholder carries capitals, the real name does not
export const SITE_URL = new URL("https://www.__PRODUCT__.com").origin;
export const REPO_URL = "https://github.com/krizaka/__PRODUCT__";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";
