import * as React from "react";
import { TextVerySmallNormal } from "../../components/StyledText";
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
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
  removeUserHasNewFavoritesActionCreator,
  removeUserLocalizedWarningHiddenActionCreator,
  removeUserAllFavoritesActionCreator,
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
import AccessibleIcon from "../../theme/images/accessibility/accessible-icon.svg";
import { ageFilters } from "../../data/filtersData";
import { updateAppUser } from "../../utils/API";
import { firstLetterUpperCase } from "../../libs";
import { Page, SectionTitle } from "../../components";
import { frenchLevelFilters } from "../../data/filtersData";

const DeleteDataContainer = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.margin * 7}px;
`;

const ProfilButtonsContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 5}px;
  ${({ theme }) => theme.shadows.lg}
`;

export const ProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "ProfilScreen">) => {
  const [isDeleteDataModalVisible, setDeleteDataModalVisible] =
    React.useState(false);
  const [isReinitAppModalVisible, setReinitAppModalVisible] =
    React.useState(false);

  const toggleDeleteDataModal = () =>
    setDeleteDataModalVisible(!isDeleteDataModalVisible);

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
        dispatch(removeSelectedLanguageActionCreator());
        dispatch(removeUserHasNewFavoritesActionCreator());
        dispatch(removeUserLocalizedWarningHiddenActionCreator());
        dispatch(removeUserAllFavoritesActionCreator());
        dispatch(removeHasUserSeenOnboardingActionCreator());
      });
  };

  const selectedAgeName: string =
    ageFilters.find((age) => {
      return age.key === selectedAge;
    })?.name || "";

  return (
    <Page
      headerIconName="person-outline"
      headerTitle={t("tab_bar.profile", "Profil")}
      hideBack
    >
      <SectionTitle accessibilityRole="header">
        {t("profile_screens.my_profile", "Mon profil")}
      </SectionTitle>
      <ProfilButtonsContainer>
        <ProfilDetailButton
          iconName="globe-2-outline"
          category={t("profile_screens.my_language", "Langue choisie")}
          userChoice={selectedLanguage.langueLoc}
          isFirst={true}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("LangueProfilScreen")}
        />
        <ProfilDetailButton
          iconName="pin-outline"
          category={t("profile_screens.city", "Ville")}
          userChoice={
            selectedLocation.city ||
            t("profile_screens.whole_country", "Toute la France")
          }
          isFirst={false}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("CityProfilScreen")}
        />
        <ProfilDetailButton
          iconName="calendar-outline"
          category={t("profile_screens.age", "age")}
          userChoice={
            selectedAgeName
              ? t("filters." + selectedAgeName, selectedAgeName)
              : t("profile_screens.all_ages", "Tous les âges")
          }
          isFirst={false}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("AgeProfilScreen")}
        />
        <ProfilDetailButton
          iconName="message-circle-outline"
          category={t("profile_screens.french", "Français")}
          userChoice={
            selectedFrenchLevel
              ? t("filters." + formattedLevel?.name, selectedFrenchLevel)
              : t("profile_screens.all_levels", "Tous les niveaux")
          }
          isFirst={false}
          isLast={true}
          isRTL={isRTL}
          onPress={() => navigation.navigate("FrenchLevelProfilScreen")}
        />
      </ProfilButtonsContainer>

      <DeleteDataContainer>
        <CustomButton
          textColor={styles.colors.black}
          i18nKey="profile_screens.delete_informations_button"
          defaultText="Supprimer les données de mon profil"
          onPress={toggleDeleteDataModal}
          backgroundColor={styles.colors.grey60}
          isTextNotBold={true}
        />
      </DeleteDataContainer>
      <SectionTitle accessibilityRole="header">
        {firstLetterUpperCase(t("notifications.settings", "Paramètres"))}
      </SectionTitle>
      <ProfilButtonsContainer>
        <ProfilDetailButton
          iconName="bell-outline"
          category={t("notifications.notifications", "Notifications")}
          isFirst={true}
          isLast={true}
          isRTL={isRTL}
          onPress={() => navigation.navigate("NotificationsSettingsScreen")}
        />
      </ProfilButtonsContainer>
      <SectionTitle accessibilityRole="header">
        {t(
          "profile_screens.app_informations",
          "Informations sur l'application"
        )}
      </SectionTitle>
      <ProfilButtonsContainer>
        <ProfilDetailButton
          iconName="question-mark-circle-outline"
          category={t("profile_screens.about_us", "Qui sommes-nous ?")}
          isFirst={true}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("AboutScreen")}
        />
        <ProfilDetailButton
          iconName="lock-outline"
          category={t(
            "profile_screens.privacy_policy",
            "Politique de confidentialité"
          )}
          isFirst={false}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("PrivacyPolicyScreen")}
        />
        <ProfilDetailButton
          iconName="file-text-outline"
          category={t("profile_screens.legal_notice", "Mentions légales")}
          isFirst={false}
          isLast={false}
          isRTL={isRTL}
          onPress={() => navigation.navigate("LegalNoticeScreen")}
        />
        <ProfilDetailButton
          iconImage={AccessibleIcon}
          category={t(
            "profile_screens.accessibility",
            "Déclaration d'accessibilité"
          )}
          isFirst={false}
          isLast={true}
          isRTL={isRTL}
          onPress={() => navigation.navigate("AccessibilityScreen")}
        />
      </ProfilButtonsContainer>
      <DeleteDataContainer>
        <CustomButton
          textColor={styles.colors.black}
          i18nKey="profile_screens.reinit_app_button"
          defaultText="Réinitialiser l'application"
          onPress={toggleReinitAppModal}
          backgroundColor={styles.colors.grey60}
          isTextNotBold={true}
        />
      </DeleteDataContainer>
      <TextVerySmallNormal
        style={{ textAlign: "center", color: styles.colors.darkGrey }}
      >
        Version {Constants.expoConfig?.extra?.displayVersionNumber}
      </TextVerySmallNormal>
      <ConfirmationModal
        isModalVisible={isDeleteDataModalVisible}
        toggleModal={toggleDeleteDataModal}
        text={t(
          "profile_screens.delete_data",
          "Es-tu sûr de vouloir supprimer les données de ton profil ?"
        )}
        onValidate={deleteUserData}
      />
      <ConfirmationModal
        isModalVisible={isReinitAppModalVisible}
        toggleModal={toggleReinitAppModal}
        text={t(
          "profile_screens.reinit_app2",
          "Es-tu sûr de vouloir réinitialiser ton application ?"
        )}
        onValidate={reinitializeApp}
      />
    </Page>
  );
};
