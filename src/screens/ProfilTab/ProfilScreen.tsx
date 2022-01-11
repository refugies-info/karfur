import * as React from "react";
import {
  TextSmallNormal,
  TextVerySmallNormal
} from "../../components/StyledText";
import { View } from "react-native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import * as Analytics from "expo-firebase-analytics";
import {
  removeUserFrenchLevelActionCreator,
  removeUserAgeActionCreator,
  removeUserLocationActionCreator,
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
  removeUserHasNewFavoritesActionCreator,
  removeUserLocalizedWarningHiddenActionCreator,
  removeUserAllFavoritesActionCreator
} from "../../services/redux/User/user.actions";
import { ProfilDetailButton } from "../../components/Profil/ProfilDetailButton";
import { HeaderAnimated } from "../../components/HeaderAnimated";
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
import { LanguageChoiceModal } from "../Modals/LanguageChoiceModal";
import { CustomButton } from "../../components/CustomButton"
import { useHeaderAnimation } from "../../hooks/useHeaderAnimation";
import AccessibleIcon from "../../theme/images/accessibility/accessible-icon.svg";

const DeleteDataContainer = styled.TouchableOpacity`
  align-items: center;
  margin-top: ${theme.margin * 5}px;
  margin-bottom: ${theme.margin * 7}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const ContentContainer = styled.ScrollView`
padding-bottom: ${theme.margin * 3}px;
padding-top: ${theme.margin * 2}px;
`;
const StyledText = styled(TextSmallNormal)`
  padding-horizontal: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin * 3}px;
  `;

const ProfilButtonsContainer = styled.View`
  margin-horizontal: ${theme.margin * 3}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  ${theme.shadows.lg}
`;

export const ProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "ProfilScreen">) => {
  const [isDeleteDataModalVisible, setDeleteDataModalVisible] = React.useState(
    false
  );
  const [isReinitAppModalVisible, setReinitAppModalVisible] = React.useState(
    false
  );
  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(
    false
  );

  const toggleDeleteDataModal = () =>
    setDeleteDataModalVisible(!isDeleteDataModalVisible);

  const toggleReinitAppModal = () =>
    setReinitAppModalVisible(!isReinitAppModalVisible);

  const toggleLanguageModal = () =>
    setLanguageModalVisible(!isLanguageModalVisible);

  const { t, isRTL } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);

  const { handleScroll, showSimplifiedHeader } = useHeaderAnimation();

  const selectedLanguage = getSelectedLanguageFromI18nCode(
    selectedLanguageI18nCode
  );

  const selectedLocation = useSelector(userLocationSelector);
  const selectedAge = useSelector(userAgeSelector);
  const selectedFrenchLevel = useSelector(userFrenchLevelSelector);

  const dispatch = useDispatch();

  const deleteUserData = () => {
    dispatch(removeUserFrenchLevelActionCreator(true));
    dispatch(removeUserAgeActionCreator(true));
    dispatch(removeUserLocationActionCreator(true));
  };

  const reinitializeApp = () => {
    Analytics.resetAnalyticsData().then(() => {
      dispatch(removeSelectedLanguageActionCreator());
      deleteUserData();
      dispatch(removeUserHasNewFavoritesActionCreator());
      dispatch(removeUserLocalizedWarningHiddenActionCreator());
      dispatch(removeUserAllFavoritesActionCreator());
      dispatch(removeHasUserSeenOnboardingActionCreator());
    })
  };

  return (
    <View style={{flex: 1}}>
      <HeaderAnimated
        title={t("tab_bar.profile", "Profil")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
        useShadow={true}
      />

      <ContentContainer
        onScroll={handleScroll}
        scrollEventThrottle={5}
      >
        <StyledText>{t("profile_screens.my_profile", "Mon profil")}</StyledText>
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
              selectedLocation.city || t("profile_screens.whole_country", "Toute la France")
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
              selectedAge
                ? t("filters." + selectedAge, selectedAge)
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
                ? t("filters." + selectedFrenchLevel, selectedFrenchLevel)
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
            textColor={theme.colors.black}
            i18nKey="profile_screens.delete_informations_button"
            defaultText="Supprimer les données de mon profil"
            onPress={toggleDeleteDataModal}
            backgroundColor={theme.colors.grey60}
            isTextNotBold={true}
          />
        </DeleteDataContainer>
        <StyledText>{t("profile_screens.app_informations", "Informations sur l'application")}</StyledText>
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
            category={t("profile_screens.privacy_policy", "Politique de confidentialité")}
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
            category={t("profile_screens.accessibility", "Déclaration d'accessibilité")}
            isFirst={false}
            isLast={true}
            isRTL={isRTL}
            onPress={() => navigation.navigate("AccessibilityScreen")}
          />
        </ProfilButtonsContainer>
        <DeleteDataContainer>
          <CustomButton
            textColor={theme.colors.black}
            i18nKey="profile_screens.reinit_app_button"
            defaultText="Réinitialiser l'application"
            onPress={toggleReinitAppModal}
            backgroundColor={theme.colors.grey60}
            isTextNotBold={true}
          />
        </DeleteDataContainer>
        <View style={{ marginBottom: theme.margin * 7 }}>
          <TextVerySmallNormal style={{ textAlign: "center", color: theme.colors.darkGrey }}>
            Version {Constants.manifest?.extra?.displayVersionNumber}
          </TextVerySmallNormal>
        </View>
      </ContentContainer>
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
      <LanguageChoiceModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleLanguageModal}
      />
    </View>
  );
};
