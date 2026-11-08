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

describe("the app renders", () => {
  it("shows the Home screen on first open (English)", async () => {
    const { findByText } = await render(<AppTree />);
    expect(await findByText("__Product__")).toBeTruthy();
  });

  it("shows tab labels for Home and Settings", async () => {
    const { findByText, getByText } = await render(<AppTree />);
    await findByText("__Product__");
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Settings")).toBeTruthy();
  });
});
