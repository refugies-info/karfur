import * as React from "react";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import { theme } from "../theme";
import { HeaderWithLogo } from "../components/HeaderWithLogo";
import { ScrollView } from "react-native-gesture-handler";
import { LanguageDetailsButton } from "../components/Language/LanguageDetailsButton";
import { activatedLanguages } from "../data/languagesData";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { AvailableLanguageI18nCode } from "../types/interface";
import { OnboardingParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
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
    <ScrollView>
      <HeaderWithLogo />
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
    </ScrollView>
  );
};
