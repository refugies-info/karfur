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

import { firstLetterUpperCase } from "../../libs";

import { TextBigBold, TextNormalBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ToggleButton } from "../../components/UI/ToggleButton";
import { EnableNotifications } from "../../components/Notifications/EnableNotifications";

import { tags } from "../../data/tagData";

const Title = styled(TextBigBold)`
  margin-bottom: ${theme.margin * 2}px;
`;

const THEMES = [
  {
    key: "gérer mes papiers",
    icon: "bell",
  },
  {
    key: "apprendre le français",
    icon: "bell",
  },
  {
    key: "trouver un travail",
    icon: "bell",
  },
  {
    key: "faire des études",
    icon: "bell",
  },
  {
    key: "occuper mon temps libre",
    icon: "bell",
  },
  {
    key: "me loger",
    icon: "bell",
  },
  {
    key: "apprendre un métier",
    icon: "bell",
  },
  {
    key: "découvrir la culture",
    icon: "bell",
  },
  {
    key: "me déplacer",
    icon: "bell",
  },
  {
    key: "me soigner",
    icon: "bell",
  },
  {
    key: "aider une association",
    icon: "bell",
  },
  {
    key: "rencontrer des gens",
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
        <Title>{t("notifications.notifications")}</Title>
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
            <TextNormalBold>{t("notifications.newFiches")}</TextNormalBold>
            <View accessibilityRole="radiogroup" style={styles.toggleContainer}>
              <ToggleButton
                title={`${t("notifications.settingsLocal")} ${
                  !!location.city ? `: ${location.city}` : ""
                }`}
                subtitle={t("notifications.settingsLocalSubtitle")}
                enabled={hasSetLocation && settings?.local}
                onToggle={updateLocalSettings}
              />
              <View style={styles.separator} />
              <ToggleButton
                title={t("notifications.settingsGlobal")}
                subtitle={t("notifications.settingsGlobalSubtitle")}
                enabled={settings?.global}
                onToggle={(state) => updateSettings("global", state)}
              />
              <View style={styles.separator} />
              <ToggleButton
                title={t("notifications.settingsDemarches")}
                subtitle={t("notifications.settingsDemarchesSubtitle")}
                enabled={settings?.demarches}
                onToggle={(state) => updateSettings("demarches", state)}
              />
            </View>
            <TextNormalBold>{t("notifications.themes")}</TextNormalBold>
            <View accessibilityRole="radiogroup" style={styles.toggleContainer}>
              {tags.map((tag, index) => (
                <>
                  <ToggleButton
                    key={tag.name}
                    title={
                      firstLetterUpperCase(
                        t(`tags.${tag.name}`, tag.name)
                      ) as string
                    }
                    icon={tag.icon}
                    enabled={settings?.themes[tag.name]}
                    onToggle={(state) =>
                      updateSettings(`themes.${tag.name}`, state)
                    }
                    disabled={themesDisabled}
                  />
                  {index < THEMES.length - 1 && (
                    <View
                      style={styles.separator}
                      key={`separator-${tag.name}`}
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
