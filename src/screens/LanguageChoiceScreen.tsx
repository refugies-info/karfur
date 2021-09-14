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
import { ScrollView } from "react-native-gesture-handler";

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
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.margin * 2,
          paddingBottom: theme.margin * 3,
          paddingTop: theme.margin,

          justifyContent: "center",
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        {activatedLanguages.map((language, index) => (
          <LanguageDetailsButton
            langueFr={language.langueFr}
            key={index}
            langueLoc={language.langueLoc}
            onPress={() => changeLanguage(language.i18nCode)}
          />
        ))}
      </ScrollView>
    </MainView>
  );
};
