import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SvgUri } from "react-native-svg";
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
import {
  Page,
  RadioGroup,
  Separator,
  StyledTextDSFR_L,
  StyledTextSmall,
} from "../../components";
import { SeparatorSpacing } from "../../components/layout/Separator/Separator";

import { getImageUri } from "../../libs/getImageUri";
import LocalIcon from "../../theme/images/profile/local-icon.svg";
import DemarcheIcon from "../../theme/images/profile/demarches-icon.svg";

const stylesheet = StyleSheet.create({
  toggleContainer: {
    display: "flex",
    marginBottom: styles.margin * 3,
    backgroundColor: styles.colors.white,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: styles.colors.dsfr_borderGrey,
    paddingVertical: styles.margin,
    paddingHorizontal: styles.margin * 3,
  },
});
const SectionTitle = styled(StyledTextDSFR_L)`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin}px;
`;
const SectionSubtitle = styled(StyledTextSmall)`
  margin-bottom: ${({ theme }) => theme.margin * 2}px;
  color: ${({ theme }) => theme.colors.dsfr_grey};
`;

export const NotificationsSettingsScreen = () => {
  const { t } = useTranslationWithRTL();
  const navigation =
    useNavigation<
      StackNavigationProp<ProfileParamList, "NotificationsSettingsScreen">
    >();
  const theme = useTheme();
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
    <Page
      loading={!settings}
      headerTitle={t("notifications.notifications")}
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
      headerIconName="bell-outline"
    >
      {settings && (
        <>
          <RadioGroup style={stylesheet.toggleContainer}>
            <SectionTitle accessibilityRole="header">
              {t("notifications.newFiches")}
            </SectionTitle>
            <SectionSubtitle>
              Choisis le type de fiches pour lequel tu souhaites recevoir des
              notifications.
            </SectionSubtitle>
            <ToggleButton
              title={`${t("notifications.settingsLocal")} ${
                !!location.city ? `: ${location.city}` : ""
              }`}
              subtitle={t("notifications.settingsLocalSubtitle")}
              enabled={hasSetLocation && settings?.local}
              onToggle={updateLocalSettings}
              icon={<LocalIcon width={24} height={24} />}
            />
            <Separator spacing={SeparatorSpacing.NoSpace} fullWidth />
            {/* Update API to remove completely
            <ToggleButton
              title={t("notifications.settingsGlobal")}
              subtitle={t("notifications.settingsGlobalSubtitle")}
              enabled={settings?.global}
              onToggle={(state) => updateSettings("global", state)}
            />
            <Separator spacing={SeparatorSpacing.NoSpace} fullWidth /> */}
            <ToggleButton
              title={t("notifications.settingsDemarches")}
              subtitle={t("notifications.settingsDemarchesSubtitle")}
              enabled={settings?.demarches}
              onToggle={(state) => updateSettings("demarches", state)}
              icon={<DemarcheIcon width={24} height={24} />}
            />
          </RadioGroup>
          <RadioGroup style={stylesheet.toggleContainer}>
            <SectionTitle accessibilityRole="header">
              {t("notifications.themes")}
            </SectionTitle>
            <SectionSubtitle>
              Choisis les thèmes pour lesquels tu souhaites recevoir des
              notifications.
            </SectionSubtitle>
            {themes.map((theme, index) => (
              <View key={index}>
                <ToggleButton
                  title={firstLetterUpperCase(
                    theme.name[currentLanguageI18nCode || "fr"]
                  )}
                  icon={
                    theme.appImage ? (
                      <SvgUri
                        width={24}
                        height={32}
                        uri={getImageUri(theme.appImage.secure_url)}
                      />
                    ) : undefined
                  }
                  enabled={settings?.themes?.[theme._id.toString()]}
                  onToggle={(state) =>
                    updateSettings(`themes.${theme._id}`, state)
                  }
                  disabled={themesDisabled}
                />
                {index < themes.length - 1 && (
                  <Separator
                    spacing={SeparatorSpacing.NoSpace}
                    fullWidth
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
