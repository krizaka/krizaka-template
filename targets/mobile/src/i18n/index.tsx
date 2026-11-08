/**
 * @file i18n/index.tsx
 * @description The app's words: one catalogue per language (`en.json` is the reference, `fr.json` has the same keys),
 * the engine is `@krizaka/i18n`. The language is the device's unless the person pinned one in Settings.
 *
 * A screen never writes a word: it reads `t("home.title")`. `en.json`'s shape types the keys, so a missing French
 * key fails type-checking (`fr` is declared as `typeof en`).
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createI18n, type MessageKey, type Translate } from "@krizaka/i18n";
import en from "./en.json";
import fr from "./fr.json";
import { deviceLanguageTags } from "./deviceTags";
import { resolveLocale, type LanguagePreference, type Locale } from "./locale";

export type Messages = typeof en;
/** Every key of the catalogue. */
export type Key = MessageKey<Messages>;

export const i18n = createI18n<Messages, Locale>({ en, fr }, { defaultLocale: "en" });

interface LocaleState {
  readonly locale: Locale;
  readonly preference: LanguagePreference;
  readonly setPreference: (preference: LanguagePreference) => void;
  readonly t: Translate<Messages>;
}

export const LocaleContext = createContext<LocaleState | null>(null);

/** Speaks the device's language, or the one pinned in Settings. */
export function LocaleProvider({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const [preference, setPreference] = useState<LanguagePreference>("auto");

  const changePreference = useCallback((next: LanguagePreference) => {
    setPreference(next);
  }, []);

  const value = useMemo<LocaleState>(() => {
    const locale = resolveLocale(preference, deviceLanguageTags());
    const translate = i18n.translator(locale);
    return { locale, preference, setPreference: changePreference, t: translate };
  }, [preference, changePreference]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** What a component reads outside a provider (a unit test): English, one stable translator. */
const ENGLISH: LocaleState = {
  locale: "en",
  preference: "auto",
  setPreference: () => undefined,
  t: i18n.translator("en"),
};

/** The translator and the active language. Outside a provider (a unit test) it speaks English. */
export function useI18n(): LocaleState {
  return useContext(LocaleContext) ?? ENGLISH;
}

/** `const t = useT()` — the common case. */
export function useT(): LocaleState["t"] {
  return useI18n().t;
}
