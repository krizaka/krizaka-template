import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useT } from "../i18n";
import { useStyles } from "../ui/useStyles";
import { type Theme } from "@krizaka/ui/native";

const makeStyles = (c: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surface0,
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: c.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: c.textSecondary,
      textAlign: "center",
    },
  });

export function HomeScreen(): React.JSX.Element {
  const t = useT();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
    </View>
  );
}
