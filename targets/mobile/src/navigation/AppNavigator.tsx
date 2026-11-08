/**
 * @file AppNavigator.tsx
 * @description Root navigation: two bottom tabs — Home and Settings.
 */

import React, { useMemo } from "react";
import { NavigationContainer, DefaultTheme, type Theme as NavTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@krizaka/ui/native";
import { HomeIcon, SettingsIcon } from "@krizaka/icons/native";

import { HomeScreen } from "../screens/HomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { useT } from "../i18n";

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function AppNavigator(): React.JSX.Element {
  const { theme: c, scheme } = useTheme();
  const t = useT();

  const navTheme = useMemo<NavTheme>(
    () => ({
      ...DefaultTheme,
      dark: scheme === "dark",
      colors: {
        ...DefaultTheme.colors,
        primary: c.accent,
        background: c.surface0,
        card: c.surface1,
        text: c.textPrimary,
        border: c.borderSubtle,
        notification: c.accent,
      },
    }),
    [c, scheme],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.textSecondary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: t("tabs.home"),
            tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
            tabBarAccessibilityLabel: t("tabs.home"),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t("tabs.settings"),
            tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
            tabBarAccessibilityLabel: t("tabs.settings"),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
