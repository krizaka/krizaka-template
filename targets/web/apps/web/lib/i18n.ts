import { createI18n, type MessageKey as KeyOf } from "@krizaka/i18n";

import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

/** Every user-facing string lives in messages/<locale>.json — English is the reference; fr.json type-checks against en.json. */
export type Locale = "en" | "fr";
export type Messages = typeof en;
export type MessageKey = KeyOf<Messages>;
export const LOCALES: readonly Locale[] = ["en", "fr"];

export const i18n = createI18n<Messages, Locale>({ en, fr }, { defaultLocale: "en" });
export const { getDictionary, asLocale } = i18n;
export { format } from "@krizaka/i18n";
