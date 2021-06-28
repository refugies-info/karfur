import * as React from "react";
import {
  TextSmallNormal,
  StyledTextVerySmall,
} from "../../components/StyledText";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import {
  removeUserFrenchLevelActionCreator,
  removeUserAgeActionCreator,
  removeUserLocationActionCreator,
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
} from "../../services/redux/User/user.actions";
import { ProfilDetailButton } from "../../components/Profil/ProfilDetailButton";
import {
  selectedI18nCodeSelector,
  userLocationSelector,
  userAgeSelector,
  userFrenchLevelSelector,
} from "../../services/redux/User/user.selectors";
import { getSelectedLanguageFromI18nCode } from "../../libs/language";
import { ProfilParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";

const DeleteDataContainer = styled.TouchableOpacity`
  align-items: center;
  padding: ${theme.margin * 3}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const DeleteDataText = styled(StyledTextVerySmall)`
  color: ${theme.colors.darkBlue};
`;

const ContentContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  padding-bottom: ${theme.margin * 3}px;
  padding-top: ${theme.margin * 3}px;
`;
const StyledText = styled(TextSmallNormal)`
  margin-bottom: ${theme.margin * 2}px;
`;

const ProfilButtonsContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius * 2}px;
  box-shadow: 0px 0px 40px rgba(33, 33, 33, 0.1);
  elevation: 0.5;
`;

export const ProfilScreen = ({
  navigation,
}: StackScreenProps<ProfilParamList, "ProfilScreen">) => {
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
    dispatch(removeUserFrenchLevelActionCreator());
    dispatch(removeUserAgeActionCreator());
    dispatch(removeUserLocationActionCreator());
  };

  const reinitializeApp = () => {
    deleteUserData();
    dispatch(removeHasUserSeenOnboardingActionCreator());
    dispatch(removeSelectedLanguageActionCreator());
  };

  return (
    <WrapperWithHeaderAndLanguageModal>
      <ContentContainer>
        <StyledText>{t("Profil.Mon profil", "Mon profil")}</StyledText>
        <ProfilButtonsContainer>
          <ProfilDetailButton
            iconName="globe-2-outline"
            category={t("Profil.Langue choisie", "Langue choisie")}
            userChoice={selectedLanguage.langueLoc}
            isFirst={true}
            isLast={false}
            isRTL={isRTL}
            onPress={() => navigation.navigate("LangueProfilScreen")}
          />
          <ProfilDetailButton
            iconName="pin-outline"
            category={t("Profil.Ville", "Ville")}
            userChoice={
              selectedLocation.city || t("Toute la France", "Toute la France")
            }
            isFirst={false}
            isLast={false}
            isRTL={isRTL}
            onPress={() => navigation.navigate("CityProfilScreen")}
          />
          <ProfilDetailButton
            iconName="calendar-outline"
            category={t("Profil.Âge", "Âge")}
            userChoice={
              selectedAge
                ? t("Filter." + selectedAge, selectedAge)
                : t("Pour tout âge", "Pour tout âge")
            }
            isFirst={false}
            isLast={false}
            isRTL={isRTL}
            onPress={() => navigation.navigate("AgeProfilScreen")}
          />
          <ProfilDetailButton
            iconName="message-circle-outline"
            category={t("Profil.Niveau de français", "Niveau de français")}
            userChoice={
              selectedFrenchLevel
                ? t("Filter." + selectedFrenchLevel, selectedFrenchLevel)
                : t(
                    "Pour tout niveau de français",
                    "Pour tout niveau de français"
                  )
            }
            isFirst={false}
            isLast={true}
            isRTL={isRTL}
            onPress={() => navigation.navigate("FrenchLevelProfilScreen")}
          />
        </ProfilButtonsContainer>

        <DeleteDataContainer onPress={deleteUserData}>
          <DeleteDataText>
            {t("Profil.supprimer_data", "Supprimer les données de mon profil")}
          </DeleteDataText>
        </DeleteDataContainer>
        <StyledText>{t("Profil.Paramètres", "Paramètres")}</StyledText>
        <ProfilButtonsContainer>
          <ProfilDetailButton
            iconName="lock-outline"
            category={t("Profil.Confidentialité", "Confidentialité")}
            isFirst={true}
            isLast={true}
            isRTL={isRTL}
          />
        </ProfilButtonsContainer>
        <DeleteDataContainer onPress={reinitializeApp}>
          <DeleteDataText>
            {t("Profil.reinit_app", "Réinitialiser mon application")}
          </DeleteDataText>
        </DeleteDataContainer>
      </ContentContainer>
    </WrapperWithHeaderAndLanguageModal>
  );
};
