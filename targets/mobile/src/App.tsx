import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigation/AppNavigator";
import { LocaleProvider } from "./i18n";
import { Themed } from "./ui/Themed";

/**
 * The root: the device's language, the @krizaka/ui/native theme, then the navigator.
 */
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <Themed>
        <LocaleProvider>
          <AppNavigator />
        </LocaleProvider>
      </Themed>
    </SafeAreaProvider>
  );
}
