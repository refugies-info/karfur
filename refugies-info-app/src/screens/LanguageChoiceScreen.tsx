import * as React from "react";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import i18n from "../services/i18n";
import { fetchLanguagesActionCreator } from "../services/redux/Languages/languages.actions";
import { theme } from "../theme";
import { Header } from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { LanguageDetailsButton } from "../components/Language/LanguageDetailsButton";
import { activatedLanguages } from "../data/languagesData";
import { availableLanguagesSelector } from "../services/redux/Languages/languages.selectors";
import { Language } from "../types/interface";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 2}px;
  padding-vertical: ${theme.margin}px;
`;

const getAvancementTrad = (
  langueFr: string,
  languagesWithAvancement: Language[]
): number | null => {
  if (langueFr === "Français") return 100;
  if (languagesWithAvancement.length === 0) {
    return null;
  }
  const correspondingData = languagesWithAvancement.filter(
    (langue) => langue.langueFr === langueFr
  );
  if (correspondingData.length === 0) return null;
  return Math.round(correspondingData[0].avancementTrad * 100);
};

export const LanguageChoiceScreen = () => {
  const dispatch = useDispatch();

  const languagesWithAvancement = useSelector(availableLanguagesSelector);

  React.useEffect(() => {
    dispatch(fetchLanguagesActionCreator());
  }, []);

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
            avancementTrad={getAvancementTrad(
              language.langueFr,
              languagesWithAvancement
            )}
            onPress={() => changeLanguage(language.i18nCode)}
          />
        ))}
      </MainContainer>
    </ScrollView>
  );
};
