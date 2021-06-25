import * as React from "react";
import { TextNormal, StyledTextVerySmall } from "../../components/StyledText";
import { Button, AsyncStorage } from "react-native";
import { WrapperWithHeaderAndLanguageModal } from "../WrapperWithHeaderAndLanguageModal";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { useDispatch } from "react-redux";
import {
  removeUserFrenchLevelActionCreator,
  removeUserAgeActionCreator,
  removeUserLocationActionCreator,
  removeHasUserSeenOnboardingActionCreator,
  removeSelectedLanguageActionCreator,
} from "../../services/redux/User/user.actions";

const DeleteDataContainer = styled.TouchableOpacity`
  align-items: center;
  padding: ${theme.margin * 3}px;
  margin-horizontal: ${theme.margin * 3}px;
`;

const DeleteDataText = styled(StyledTextVerySmall)`
  color: ${theme.colors.darkBlue};
`;
export const ProfilScreen = () => {
  const { t } = useTranslationWithRTL();

  const cleanStorage = (value: string) => {
    try {
      AsyncStorage.removeItem(value);
    } catch (e) {}
  };

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
      <TextNormal>Profil screen</TextNormal>

      <TextNormal>{t("lists", "options")}</TextNormal>
      <TextNormal>{t("homepage.test", "options")}</TextNormal>
      <Button
        onPress={() => cleanStorage("SELECTED_LANGUAGE")}
        title="Reset langue"
      />
      <Button
        onPress={() => cleanStorage("HAS_USER_SEEN_ONBOARDING")}
        title="Reset has seen onboarding"
      />

      <DeleteDataContainer onPress={deleteUserData}>
        <DeleteDataText>
          {t("Profil.supprimer_data", "Supprimer les données de mon profil")}
        </DeleteDataText>
      </DeleteDataContainer>
      <DeleteDataContainer onPress={reinitializeApp}>
        <DeleteDataText>
          {t("Profil.reinit_app", "Réinitialiser mon application")}
        </DeleteDataText>
      </DeleteDataContainer>
    </WrapperWithHeaderAndLanguageModal>
  );
};
