import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextNormalBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { RootStackParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { useSelector, useDispatch } from "react-redux";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { AvailableLanguageI18nCode } from "../../types/interface";
import { activatedLanguages } from "../../data/languagesData";
import { LanguageDetailsButton } from "../../components/Language/LanguageDetailsButton";
import { theme } from "../../theme";
import { ScrollView } from "react-native-gesture-handler";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  justify-content: center;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled(TextNormalBold)`
  margin-horizontal: ${theme.margin * 3}px;
  margin-top: ${theme.margin * 3}px;
  margin-bottom: ${theme.margin}px;
`;

export const LangueProfilScreen = ({
  navigation,
}: StackScreenProps<RootStackParamList, "LangueProfilScreen">) => {
  const { t, i18n } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();

  const changeLanguage = (ln: AvailableLanguageI18nCode) => {
    i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: true,
      })
    );
    return navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <HeaderWithBack
        navigation={navigation}
        text={t("Profil.Langue choisie", "Langue choisie")}
        iconName="globe-2-outline"
      />
      <HeaderText>
        {t("Profil.choix langue", "Choisis la langue de l’application")}
      </HeaderText>
      <ScrollView
        contentContainerStyle={{
          paddingTop: theme.margin * 2,
        }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <MainContainer>
          {activatedLanguages.map((language, index) => (
            <LanguageDetailsButton
              langueFr={language.langueFr}
              key={index}
              langueLoc={language.langueLoc}
              onPress={() => changeLanguage(language.i18nCode)}
              isSelected={language.i18nCode === selectedLanguageI18nCode}
            />
          ))}
        </MainContainer>
      </ScrollView>
    </SafeAreaView>
  );
};
