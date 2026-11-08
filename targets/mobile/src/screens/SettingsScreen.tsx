import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useI18n, useT } from "../i18n";
import { useStyles } from "../ui/useStyles";
import { type Theme } from "@krizaka/ui/native";

const makeStyles = (c: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.surface0,
      padding: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: c.textPrimary,
      marginBottom: 24,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSubtle,
    },
    label: {
      fontSize: 16,
      color: c.textPrimary,
    },
    value: {
      fontSize: 16,
      color: c.textSecondary,
    },
  });

export function SettingsScreen(): React.JSX.Element {
  const t = useT();
  const { locale } = useI18n();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings.title")}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{t("settings.language")}</Text>
        <Text style={styles.value}>{locale === "fr" ? t("settings.languageFr") : t("settings.languageEn")}</Text>
      </View>
    </View>
  );
}
