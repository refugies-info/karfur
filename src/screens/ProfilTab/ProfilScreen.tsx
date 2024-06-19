import * as React from "react";
import { TextDSFR_L_Bold, TextDSFR_XS } from "../../components/StyledText";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { styles } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import analytics from "@react-native-firebase/analytics";
import {
  removeUserFrenchLevelActionCreator,
  removeUserAgeActionCreator,
  removeUserLocationActionCreator,
  resetUserActionCreator,
} from "../../services/redux/User/user.actions";
import { ProfilDetailButton } from "../../components/Profil/ProfilDetailButton";
import {
  selectedI18nCodeSelector,
  userLocationSelector,
  userAgeSelector,
  userFrenchLevelSelector,
} from "../../services/redux/User/user.selectors";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { CustomButton } from "../../components/CustomButton";
import { ageFilters } from "../../data/filtersData";
import { updateAppUser } from "../../utils/API";
import { firstLetterUpperCase } from "../../libs";
import { Columns, Flag, Page, Spacer } from "../../components";
import { frenchLevelFilters } from "../../data/filtersData";
import { useTheme } from "styled-components/native";
import { H1 } from "../../components/Profil/Typography";
import UserProfileIcon from "../../theme/images/profile/user-profile.svg";
import { MascotteSpeaking } from "../../components/Profil/MascotteSpeaking";
import { Linking } from "react-native";

// TODO: use separator from components
const Separator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.dsfr_borderGrey};
`;

const ProfilButtonsContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.margin * 5}px;
  border: 1px solid ${({ theme }) => theme.colors.dsfr_borderGrey};
  padding-vertical: ${({ theme }) => theme.margin}px;
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
`;

const Section = styled.View<{ darkBackground?: boolean }>`
  background-color: ${({ theme, darkBackground }) =>
    darkBackground ? theme.colors.dsfr_backgroundBlue : "white"};
  padding-horizontal: ${({ theme }) => theme.margin * 3}px;
  padding-top: ${({ theme }) => theme.margin * 3}px;
`;
const SectionTitle = styled(TextDSFR_L_Bold)`
  padding-vertical: ${({ theme }) => theme.margin * 2}px;
`;

export const ProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "ProfilScreen">) => {
  const theme = useTheme();
  const [isReinitAppModalVisible, setReinitAppModalVisible] =
    React.useState(false);

  const toggleReinitAppModal = () =>
    setReinitAppModalVisible(!isReinitAppModalVisible);

  const { t, isRTL } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  const selectedLanguage = getSelectedLanguageFromI18nCode(
    selectedLanguageI18nCode
  );

  const selectedLocation = useSelector(userLocationSelector);
  const selectedAge = useSelector(userAgeSelector);
  const selectedFrenchLevel = useSelector(userFrenchLevelSelector);
  const formattedLevel = frenchLevelFilters.find(
    (frenchLevelFilter) => frenchLevelFilter.key === selectedFrenchLevel
  );

  const dispatch = useDispatch();

  const deleteUserData = () => {
    dispatch(removeUserFrenchLevelActionCreator(true));
    dispatch(removeUserAgeActionCreator(true));
    dispatch(removeUserLocationActionCreator(true));
    return updateAppUser({
      selectedLanguage: undefined,
      city: undefined,
      department: undefined,
      age: undefined,
      frenchLevel: undefined,
      expoPushToken: undefined,
    });
  };

  const reinitializeApp = () => {
    analytics()
      .resetAnalyticsData()
      .then(() => deleteUserData())
      .then(() => {
        dispatch(resetUserActionCreator());
      });
  };

  const selectedAgeName: string =
    ageFilters.find((age) => {
      return age.key === selectedAge;
    })?.name || "";

  return (
    <Page
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
      contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
    >
      <Section darkBackground>
        <Columns RTLBehaviour layout="auto 1" verticalAlign="top">
          <UserProfileIcon width={32} height={32} />
          <H1
            style={{ color: theme.colors.dsfr_action }}
            accessibilityRole="header"
          >
            {t("profile_screens.my_profile", "Mes informations")}
          </H1>
        </Columns>

        <ProfilDetailButton
          iconName="pin-outline"
          label={selectedLocation.city || t("profile_screens.city", "Ville")}
          onPress={() => navigation.navigate("CityProfilScreen")}
          isEmpty={selectedLocation.city === null}
          isBold={selectedLocation.city !== null}
          iconRight="edit"
          id="city"
        />
        <ProfilDetailButton
          iconName="calendar-outline"
          label={
            selectedAgeName
              ? t("filters." + selectedAgeName, selectedAgeName)
              : t("profile_screens.age", "age")
          }
          onPress={() => navigation.navigate("AgeProfilScreen")}
          isEmpty={!selectedAge}
          isBold={!!selectedAge}
          iconRight="edit"
          id="age"
        />
        <ProfilDetailButton
          iconName="message-circle-outline"
          label={
            selectedFrenchLevel
              ? t("filters." + formattedLevel?.name, selectedFrenchLevel)
              : t("profile_screens.french", "Français")
          }
          onPress={() => navigation.navigate("FrenchLevelProfilScreen")}
          isEmpty={selectedFrenchLevel === null}
          isBold={selectedFrenchLevel !== null}
          iconRight="edit"
          id="french"
        />

        <MascotteSpeaking />
      </Section>
      <Spacer height={theme.margin * 2} />
      <Section>
        <ProfilButtonsContainer>
          <SectionTitle accessibilityRole="header">
            {firstLetterUpperCase(t("notifications.settings", "Paramètres"))}
          </SectionTitle>
          <ProfilDetailButton
            iconImage={<Flag langueFr={selectedLanguage.langueFr} />}
            label={selectedLanguage.langueLoc}
            onPress={() => navigation.navigate("LangueProfilScreen")}
            inList
            iconRight="edit"
            id="language-button"
          />
          <Separator />
          <ProfilDetailButton
            iconName="bell-outline"
            label={t("notifications.notifications", "Notifications")}
            onPress={() => navigation.navigate("NotificationsSettingsScreen")}
            inList
            iconRight="navigate"
          />
        </ProfilButtonsContainer>

        <ProfilDetailButton
          iconName="gift-outline"
          label="Partager l'application"
          onPress={() => navigation.navigate("ShareScreen")}
          iconRight="navigate"
          purpleVariant
        />
        <Spacer height={theme.margin * 3} />

        <ProfilButtonsContainer>
          <SectionTitle accessibilityRole="header">
            {t(
              "profile_screens.app_informations",
              "Informations sur l'application"
            )}
          </SectionTitle>
          <ProfilDetailButton
            iconName="question-mark-circle-outline"
            label={t("profile_screens.about_us", "Qui sommes-nous ?")}
            onPress={() => navigation.navigate("AboutScreen")}
            inList
            iconRight="navigate"
          />
          <Separator />

          <ProfilDetailButton
            iconName="lock-outline"
            label={t(
              "profile_screens.privacy_policy",
              "Politique de confidentialité"
            )}
            onPress={() => navigation.navigate("PrivacyPolicyScreen")}
            inList
            iconRight="navigate"
          />
          <Separator />

          <ProfilDetailButton
            iconName="file-text-outline"
            label={t("profile_screens.legal_notice", "Mentions légales")}
            onPress={() => navigation.navigate("LegalNoticeScreen")}
            inList
            iconRight="navigate"
          />
          <Separator />

          <ProfilDetailButton
            iconName="file-text-outline"
            label={t(
              "profile_screens.accessibility",
              "Déclaration d'accessibilité"
            )}
            onPress={() => navigation.navigate("AccessibilityScreen")}
            inList
            iconRight="navigate"
          />
          <Separator />

          <ProfilDetailButton
            iconName="plus-circle-outline"
            label={"Publier une fiche"}
            onPress={() => Linking.openURL("https://refugies.info/fr/publier")}
            inList
            iconRight="external"
          />
          <Separator />

          <ProfilDetailButton
            iconName="globe-outline"
            label={"Aider à traduire"}
            onPress={() => Linking.openURL("https://refugies.info/fr/traduire")}
            inList
            iconRight="external"
          />
        </ProfilButtonsContainer>
        <CustomButton
          textColor={styles.colors.dsfr_error}
          i18nKey="profile_screens.reinit_app_button"
          defaultText="Réinitialiser l'application"
          onPress={toggleReinitAppModal}
          withShadows={false}
          iconName="refresh-outline"
          iconFirst
        />
        <Spacer height={theme.margin * 5} />
        <TextDSFR_XS
          style={{ textAlign: "center", color: styles.colors.darkGrey }}
        >
          Version {Constants.expoConfig?.extra?.displayVersionNumber}
        </TextDSFR_XS>
        <Spacer height={theme.margin * 5} />

        <ConfirmationModal
          isModalVisible={isReinitAppModalVisible}
          toggleModal={toggleReinitAppModal}
          text={t(
            "profile_screens.reinit_app2",
            "Es-tu sûr de vouloir réinitialiser ton application ?"
          )}
          onValidate={reinitializeApp}
        />
      </Section>
    </Page>
  );
};
