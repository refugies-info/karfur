import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { styles } from "../../theme";

import {
  currentI18nCodeSelector,
  userLocationSelector,
} from "../../services/redux/User/user.selectors";

import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { useNotificationsSettings } from "../../hooks/useNotificationSettings";
import { useNotificationsStatus } from "../../hooks/useNotificationsStatus";

import { firstLetterUpperCase } from "../../libs";

import { ToggleButton } from "../../components/UI/ToggleButton";

import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileParamList } from "../../../types";
import { themesSelector } from "../../services/redux/Themes/themes.selectors";
import { Page, RadioGroup, SectionTitle, Separator } from "../../components";
import { SeparatorSpacing } from "../../components/layout/Separator/Separator";

const stylesheet = StyleSheet.create({
  toggleContainer: {
    display: "flex",
    marginBottom: styles.margin * 4,
    borderRadius: styles.radius * 2,
    backgroundColor: styles.colors.white,
    ...styles.shadowsStylesheet.lg,
  },
});

export const NotificationsSettingsScreen = () => {
  const { t } = useTranslationWithRTL();
  const navigation =
    useNavigation<
      StackNavigationProp<ProfileParamList, "NotificationsSettingsScreen">
    >();
  const [settings, updateSettings] = useNotificationsSettings();
  const [accessGranted] = useNotificationsStatus();
  const location = useSelector(userLocationSelector);
  const themes = useSelector(themesSelector);
  const currentLanguageI18nCode = useSelector(currentI18nCodeSelector);

  const [hasSetLocation, setHasSetLocation] = useState(
    !!(location && location.department && location.city)
  );
  useEffect(() => {
    const newHasSetLocation = !!(
      location &&
      location.department &&
      location.city
    );
    if (hasSetLocation !== newHasSetLocation) {
      setHasSetLocation(newHasSetLocation);
      if (!settings?.local && newHasSetLocation) updateSettings("local", true);
      if (settings?.local && !newHasSetLocation) updateSettings("local", false);
    }
  }, [location]);

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
    <Page loading={!settings} headerTitle={t("notifications.notifications")}>
      {settings && (
        <>
          <SectionTitle>{t("notifications.newFiches")}</SectionTitle>
          <RadioGroup style={stylesheet.toggleContainer}>
            <ToggleButton
              title={`${t("notifications.settingsLocal")} ${
                !!location.city ? `: ${location.city}` : ""
              }`}
              subtitle={t("notifications.settingsLocalSubtitle")}
              enabled={hasSetLocation && settings?.local}
              onToggle={updateLocalSettings}
            />
            <Separator spacing={SeparatorSpacing.Small} />
            <ToggleButton
              title={t("notifications.settingsGlobal")}
              subtitle={t("notifications.settingsGlobalSubtitle")}
              enabled={settings?.global}
              onToggle={(state) => updateSettings("global", state)}
            />
            <Separator spacing={SeparatorSpacing.Small} />
            <ToggleButton
              title={t("notifications.settingsDemarches")}
              subtitle={t("notifications.settingsDemarchesSubtitle")}
              enabled={settings?.demarches}
              onToggle={(state) => updateSettings("demarches", state)}
            />
          </RadioGroup>
          <SectionTitle>{t("notifications.themes")}</SectionTitle>
          <RadioGroup style={stylesheet.toggleContainer}>
            {themes.map((theme, index) => (
              <View key={index}>
                <ToggleButton
                  title={firstLetterUpperCase(
                    theme.name[currentLanguageI18nCode || "fr"]
                  )}
                  icon={theme.icon}
                  enabled={settings?.themes?.[theme._id.toString()]}
                  onToggle={(state) =>
                    updateSettings(`themes.${theme._id}`, state)
                  }
                  disabled={themesDisabled}
                />
                {index < themes.length - 1 && (
                  <Separator
                    spacing={SeparatorSpacing.Small}
                    key={`separator-${theme.name.fr}`}
                  />
                )}
              </View>
            ))}
          </RadioGroup>
        </>
      )}
    </Page>
  );
};
