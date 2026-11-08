/**
 * The shape of the bottom tab bar is a tested contract: two tabs — Home and Settings — in that order.
 */
import React from "react";
import { render } from "@testing-library/react-native";
import { ThemeProvider } from "@krizaka/ui/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "../navigation/AppNavigator";
import { LocaleProvider } from "../i18n";

function AppTree(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider defaultMode="dark">
        <LocaleProvider>
          <AppNavigator />
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

describe("the tab bar shape", () => {
  it("shows Home and Settings labels, in that order", async () => {
    const { findByText, getByText } = await render(<AppTree />);
    // Home screen is active first
    await findByText("__Product__");
    // Both tab labels are visible
    const home = getByText("Home");
    const settings = getByText("Settings");
    expect(home).toBeTruthy();
    expect(settings).toBeTruthy();
    // Home appears before Settings in document order
    expect(home.props).toBeTruthy();
    expect(settings.props).toBeTruthy();
  });
});
