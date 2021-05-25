import { Button } from "react-native";
import * as React from "react";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import i18n from "../services/i18n";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";
import { selectedI18nCodeSelector } from "../services/redux/User/user.selectors";
import { StyledTextNormal } from "../components/StyledText";
import { theme } from "../theme";
import { Header } from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { LanguageDetailsButton } from "../components/Language/LanguageDetailsButton";
import { activatedLanguages } from "../data/languagesData";

const Text2 = styled(StyledTextNormal)`
  color: red;
`;

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
`;

export const LanguageChoiceScreen = () => {
  const dispatch = useDispatch();

  const langue = useSelector(selectedI18nCodeSelector);

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, [langue]);

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
          />
        ))}

        <Text2>Text</Text2>
        <Button onPress={() => changeLanguage("ar")} title="button ar" />
        <Button onPress={() => changeLanguage("en")} title="button en" />
        <Button onPress={() => changeLanguage("fr")} title="button fr" />
        <StyledTextNormal>Test</StyledTextNormal>
        <Text2>Test1</Text2>
        <Text2>Text</Text2>
        <Button onPress={() => changeLanguage("ar")} title="button ar" />
        <Button onPress={() => changeLanguage("en")} title="button en" />
        <Button onPress={() => changeLanguage("fr")} title="button fr" />
        <StyledTextNormal>Test</StyledTextNormal>
        <Text2>Test1</Text2>
        <Text2>Text</Text2>
        <Button onPress={() => changeLanguage("ar")} title="button ar" />
        <Button onPress={() => changeLanguage("en")} title="button en" />
        <Button onPress={() => changeLanguage("fr")} title="button fr" />
        <StyledTextNormal>Test</StyledTextNormal>
        <Text2>Test1</Text2>
      </MainContainer>
    </ScrollView>
  );
};
