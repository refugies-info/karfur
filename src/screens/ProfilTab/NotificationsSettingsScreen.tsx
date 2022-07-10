import React from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { theme } from "../../theme";

import { userLocationSelector } from "../../services/redux/User/user.selectors";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useNotificationsSettings } from "../../hooks/useNotificationSettings";
import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";

import { TextBigBold, TextNormalBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ToggleButton } from "../../components/UI/ToggleButton";
import { EnableNotifications } from "../../components/Notifications/EnableNotifications";

const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 2}px;
`;

const THEMES = [
  {
    name: "Gérer mes papiers",
    key: "gérer mes papiers",
    icon: "bell",
  },
  {
    key: "apprendre le français",
    name: "Apprendre le français",
    icon: "bell",
  },
  {
    key: "trouver un travail",
    name: "Trouver un travail",
    icon: "bell",
  },
  {
    key: "faire des études",
    name: "Faire des études",
    icon: "bell",
  },
  {
    name: "Occuper mon temps libre",
    key: "occuper mon temps libre",
    icon: "bell",
  },
  {
    key: "me loger",
    name: "Me loger",
    icon: "bell",
  },
  {
    key: "apprendre un métier",
    name: "Apprendre un métier",
    icon: "bell",
  },
  {
    key: "découvrir la culture",
    name: "Découvrir la culture",
    icon: "bell",
  },
  {
    key: "me déplacer",
    name: "Me déplacer",
    icon: "bell",
  },
  {
    key: "me soigner",
    name: "Me soigner",
    icon: "bell",
  },
  {
    key: "aider une association",
    name: "Aider une association",
    icon: "bell",
  },
  {
    key: "rencontrer des gens",
    name: "Rencontrer des gens",
    icon: "bell",
  },
];

const styles = StyleSheet.create({
  toggleContainer: {
    display: "flex",
    marginVertical: theme.margin * 4,
    borderRadius: theme.radius * 2,
    backgroundColor: theme.colors.white,
    ...theme.shadowsStylesheet.lg,
  },
  separator: {
    height: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: theme.colors.grey,
    marginVertical: theme.margin / 2,
  },
});

export const NotificationsSettingsScreen = () => {
  const { t } = useTranslationWithRTL();
  const navigation = useNavigation();
  const [settings, updateSettings] = useNotificationsSettings();
  const [accessGranted] = useNotificationsStatus();
  const location = useSelector(userLocationSelector);

  const hasSetLocation = !!(location && location.department && location.city);

  const themesDisabled =
    !!settings && !settings?.global && !settings?.local && !settings?.demarches;

  const updateLocalSettings = async (state: boolean) => {
    if (!hasSetLocation) {
      navigation.navigate("CityProfilScreen");
    } else {
      await updateSettings("local", state);
    }
  };

  if (!settings) {
    return <ActivityIndicator size="small" color={theme.colors.black} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <HeaderWithBack navigation={navigation} />
      <View
        style={{
          marginHorizontal: theme.margin * 3,
          marginTop: theme.margin * 3,
        }}
      >
        <Title>{t("profile_screens.notifications", "Notifications")}</Title>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: theme.margin * 2,
          paddingHorizontal: theme.margin * 3,
        }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {!accessGranted ? (
          <EnableNotifications withMargin={false} />
        ) : !settings ? (
          <ActivityIndicator size="small" color={theme.colors.black} />
        ) : (
          <>
            <TextNormalBold>
              {t("profile_screens.notifications_subtitle", "Nouvelles fiches")}
            </TextNormalBold>
            <View accessibilityRole="radiogroup" style={styles.toggleContainer}>
              <ToggleButton
                title={`Fiches pour ta ville ${
                  !!location.city ? `: ${location.city}` : ""
                }`}
                subtitle="Exemple : Cours de français à Paris"
                enabled={hasSetLocation && settings?.local}
                onToggle={updateLocalSettings}
              />
              <View style={styles.separator} />
              <ToggleButton
                title="Fiches pour toute la France"
                subtitle="Exemple : Cours en ligne"
                enabled={settings?.global}
                onToggle={(state) => updateSettings("global", state)}
              />
              <View style={styles.separator} />
              <ToggleButton
                title="Fiches démarches"
                subtitle="Exemple : Obtenir la nationalité"
                enabled={settings?.demarches}
                onToggle={(state) => updateSettings("demarches", state)}
              />
            </View>
            <TextNormalBold>
              {t("profile_screens.notifications_theme", "Thèmes")}
            </TextNormalBold>
            <View accessibilityRole="radiogroup" style={styles.toggleContainer}>
              {THEMES.map((theme, index) => (
                <>
                  <ToggleButton
                    key={theme.key}
                    title={theme.name}
                    icon={theme.icon}
                    enabled={settings?.themes[theme.key]}
                    onToggle={(state) =>
                      updateSettings(`themes.${theme.key}`, state)
                    }
                    disabled={themesDisabled}
                  />
                  {index < THEMES.length - 1 && (
                    <View
                      style={styles.separator}
                      key={`separator-${theme.key}`}
                    />
                  )}
                </>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
