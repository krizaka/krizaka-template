import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider, useTheme, type Mode } from "@krizaka/ui/native";

/** The status bar's icons follow the resolved scheme: light icons on dark, dark on light. */
function Bar(): React.JSX.Element {
  const { scheme } = useTheme();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

/**
 * The @krizaka/ui/native theme over the platform's roles. Light and dark are both first-class:
 * the app follows the system by default. The safe-area insets are handed to the kit so its bars
 * clear the home indicator.
 */
export function Themed({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const insets = useSafeAreaInsets();
  useColorScheme();
  const [mode] = useState<Mode>("system");

  return (
    <ThemeProvider mode={mode} insets={insets}>
      <Bar />
      {children}
    </ThemeProvider>
  );
}
