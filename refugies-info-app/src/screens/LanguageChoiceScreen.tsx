import * as React from "react";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import i18n from "../services/i18n";
import { theme } from "../theme";
import { Header } from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { LanguageDetailsButton } from "../components/Language/LanguageDetailsButton";
import { activatedLanguages } from "../data/languagesData";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
`;

export const LanguageChoiceScreen = () => {
  const dispatch = useDispatch();

  const changeLanguage = (ln: string) => {
    i18n.changeLanguage(ln);
    dispatch(saveSelectedLanguageActionCreator(ln));
  };
  return (
    <ScrollView>
      <Header />
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
