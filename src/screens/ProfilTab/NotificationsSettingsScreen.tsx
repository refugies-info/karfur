import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { styles } from "../../theme";

import { currentI18nCodeSelector, userLocationSelector } from "../../services/redux/User/user.selectors";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useNotificationsSettings } from "../../hooks/useNotificationSettings";
import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";

import { firstLetterUpperCase } from "../../libs";

import { TextBigBold, TextNormalBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ToggleButton } from "../../components/UI/ToggleButton";
import { EnableNotifications } from "../../components/Notifications/EnableNotifications";

import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileParamList } from "../../../types";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";

const Title = styled(TextBigBold)`
  margin-bottom: ${styles.margin * 2}px;
`;

const stylesheet = StyleSheet.create({
  toggleContainer: {
    display: "flex",
    marginVertical: styles.margin * 4,
    borderRadius: styles.radius * 2,
    backgroundColor: styles.colors.white,
    ...styles.shadowsStylesheet.lg,
  },
  separator: {
    height: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: styles.colors.grey,
    marginVertical: styles.margin / 2,
  },
});

export const NotificationsSettingsScreen = () => {
  const { t } = useTranslationWithRTL();
  const navigation = useNavigation();
  const [settings, updateSettings] = useNotificationsSettings();
  const [accessGranted] = useNotificationsStatus();
  const location = useSelector(userLocationSelector);
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  const [hasSetLocation, setHasSetLocation] = useState(!!(location && location.department && location.city));
  useEffect(() => {
    const newHasSetLocation = !!(location && location.department && location.city);
    if (hasSetLocation !== newHasSetLocation) {
      setHasSetLocation(newHasSetLocation);
      if (!settings?.local && newHasSetLocation) updateSettings("local", true);
      if (settings?.local && !newHasSetLocation) updateSettings("local", false);
    }
  }, [location])

  const themesDisabled =
    !!settings && !settings?.global && !settings?.local && !settings?.demarches;

  const updateLocalSettings = async (state: boolean) => {
    if (!hasSetLocation) {
      navigation.navigate("CityProfilScreen");
    } else {
      await updateSettings("local", state);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <HeaderWithBack
        navigation={navigation}
        backHandler={() => {
          navigation.navigate("ProfilScreen");
        }}
      />
      <View
        style={{
          marginHorizontal: styles.margin * 3,
          marginTop: styles.margin * 3,
        }}
      >
        <Title>{t("notifications.notifications")}</Title>
      </View>

      {!settings ?
        <ActivityIndicator size="small" color={styles.colors.black} /> :
        <ScrollView
          contentContainerStyle={{
            paddingTop: styles.margin * 2,
            paddingHorizontal: styles.margin * 3,
          }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {!accessGranted ? (
            <EnableNotifications withMargin={false} />
          ) : (
            <>
              <TextNormalBold>{t("notifications.newFiches")}</TextNormalBold>
              <View accessibilityRole="radiogroup" style={stylesheet.toggleContainer}>
                <ToggleButton
                  title={`${t("notifications.settingsLocal")} ${
                    !!location.city ? `: ${location.city}` : ""
                  }`}
                  subtitle={t("notifications.settingsLocalSubtitle")}
                  enabled={hasSetLocation && settings?.local}
                  onToggle={updateLocalSettings}
                />
                <View style={stylesheet.separator} />
                <ToggleButton
                  title={t("notifications.settingsGlobal")}
                  subtitle={t("notifications.settingsGlobalSubtitle")}
                  enabled={settings?.global}
                  onToggle={(state) => updateSettings("global", state)}
                />
                <View style={stylesheet.separator} />
                <ToggleButton
                  title={t("notifications.settingsDemarches")}
                  subtitle={t("notifications.settingsDemarchesSubtitle")}
                  enabled={settings?.demarches}
                  onToggle={(state) => updateSettings("demarches", state)}
                />
              </View>
              <TextNormalBold>{t("notifications.themes")}</TextNormalBold>
              <View accessibilityRole="radiogroup" style={stylesheet.toggleContainer}>
                {themes.map((theme, index) => (
                  <View key={index}>
                    <ToggleButton
                      title={firstLetterUpperCase(theme.name[currentLanguageI18nCode||"fr"])}
                      icon={theme.icon}
                      enabled={settings?.themes[theme._id]}
                      onToggle={(state) =>
                        updateSettings(`themes.${theme._id}`, state)
                      }
                      disabled={themesDisabled}
                    />
                    {index < themes.length - 1 && (
                      <View
                        style={stylesheet.separator}
                        key={`separator-${theme.name.fr}`}
                      />
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      }
    </SafeAreaView>
  );
};
