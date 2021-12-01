import * as React from "react";
import {
  TextSmallNormal,
  StyledTextSmall,
} from "../../components/StyledText";
import { View } from "react-native";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
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

const DeleteDataContainer = styled.TouchableOpacity`
  align-items: center;
  padding: ${theme.margin * 2}px;
  margin-top: ${theme.margin * 5}px;
  margin-bottom: ${theme.margin * 7}px;
  background-color: ${theme.colors.grey60};
  border-radius: ${theme.radius * 2}px;
`;

const DeleteDataText = styled(StyledTextSmall)`
  color: ${theme.colors.black};
`;

const ContentContainer = styled.ScrollView`
  padding-horizontal: ${theme.margin * 3}px;
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 2}px;
`;
const StyledText = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin * 3}px;
`;

const ProfilButtonsContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 0.5;
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

  // Header animation
  const [showSimplifiedHeader, setShowSimplifiedHeader] = React.useState(false);
  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y > 5 && !showSimplifiedHeader) {
      setShowSimplifiedHeader(true);
      return;
    }
    if (event.nativeEvent.contentOffset.y < 5 && showSimplifiedHeader) {
      setShowSimplifiedHeader(false);
      return;
    }
    return;
  };

  return (
    <View style={{flex: 1}}>
      <HeaderAnimated
        title={t("tab_bar.profile", "Profil")}
        showSimplifiedHeader={showSimplifiedHeader}
        onLongPressSwitchLanguage={toggleLanguageModal}
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

        <DeleteDataContainer
          onPress={toggleDeleteDataModal}
          testID="test-delete-data"
          accessibilityRole="button"
        >
          <DeleteDataText>
            {t("profile_screens.delete_informations", "Supprimer les données de mon profil")}
          </DeleteDataText>
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
            isLast={true}
            isRTL={isRTL}
            onPress={() => navigation.navigate("LegalNoticeScreen")}
          />
        </ProfilButtonsContainer>
        <DeleteDataContainer
          onPress={toggleReinitAppModal}
          accessibilityRole="button"
        >
          <DeleteDataText>
            {t("profile_screens.reinit_app", "Réinitialiser l'application")}
          </DeleteDataText>
        </DeleteDataContainer>
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
