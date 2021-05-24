import { Button } from "react-native";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import i18n from "../services/i18n";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";
import { selectedI18nCodeSelector } from "../services/redux/User/user.selectors";
import { StyledTextNormal } from "../components/StyledText";
import { theme } from "../theme";
import styled from "styled-components/native";

const Text2 = styled(StyledTextNormal)`
  color: red;
`;

const MainContainer = styled.View`
  padding: ${theme.margin * 2}px;
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
    <MainContainer>
      <Text2>Text</Text2>
      <Button onPress={() => changeLanguage("ar")} title="button ar" />
      <Button onPress={() => changeLanguage("en")} title="button en" />
      <Button onPress={() => changeLanguage("fr")} title="button fr" />
      <StyledTextNormal>Test</StyledTextNormal>
      <Text2>Test1</Text2>
    </MainContainer>
  );
};
