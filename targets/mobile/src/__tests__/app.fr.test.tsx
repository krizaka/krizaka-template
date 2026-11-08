/**
 * French locale: the app renders in French when the locale is forced to `fr`.
 */
import React from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "@krizaka/ui/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "../navigation/AppNavigator";
import { LocaleContext, i18n } from "../i18n";

function FrenchApp(): React.JSX.Element {
  const t = i18n.translator("fr");
  const value = {
    locale: "fr" as const,
    preference: "fr" as const,
    setPreference: () => undefined,
    t,
  };
  return (
    <SafeAreaProvider>
      <ThemeProvider defaultMode="dark">
        <LocaleContext.Provider value={value}>
          <AppNavigator />
        </LocaleContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

describe("the app in French", () => {
  it("shows the French home title", async () => {
    const { findByText } = await render(<FrenchApp />);
    expect(await findByText("__Product__")).toBeTruthy();
  });

  it("shows the French tab labels", async () => {
    const { findByText, getByText } = await render(<FrenchApp />);
    await findByText("__Product__");
    expect(getByText("Accueil")).toBeTruthy();
    expect(getByText("Paramètres")).toBeTruthy();
  });
});
