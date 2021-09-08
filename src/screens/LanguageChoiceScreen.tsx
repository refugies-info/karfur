import * as React from "react";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import { theme } from "../theme";
import { HeaderWithLogo } from "../components/HeaderWithLogo";
import { LanguageDetailsButton } from "../components/Language/LanguageDetailsButton";
import { activatedLanguages } from "../data/languagesData";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { AvailableLanguageI18nCode } from "../types/interface";
import { OnboardingParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  justify-content: center;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainView = styled.View`
  display: flex;
  flex: 1;
`;
export const LanguageChoiceScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "OnboardingSteps">) => {
  const { i18n } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const changeLanguage = (ln: AvailableLanguageI18nCode) => {
    i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: false,
      })
    );
    navigation.navigate("OnboardingStart");
    return;
  };
  return (
    <MainView>
      <HeaderWithLogo hideLanguageSwitch={true} />
      <MainContainer>
        {activatedLanguages.map((language, index) => (
          <LanguageDetailsButton
            langueFr={language.langueFr}
            key={index}
            langueLoc={language.langueLoc}
            onPress={() => changeLanguage(language.i18nCode)}
          />
        ))}
      </MainContainer>
    </MainView>
  );
};
