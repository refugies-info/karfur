import * as React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { TextBigBold } from "../../components/StyledText";
import { HeaderWithBack } from "../../components/HeaderWithBack";
import { ProfileParamList } from "../../../types";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MainContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
  justify-content: center;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled(TextBigBold)`
  margin-horizontal: ${theme.margin * 3}px;
  margin-top: ${theme.margin * 3}px;
`;

export const LangueProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "LangueProfilScreen">) => {
  const { t, i18n } = useTranslationWithRTL();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

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
    <View
      style={{
        flex: 1,
        paddingTop: insets.top
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
          paddingBottom: theme.margin * 3,
          justifyContent: "center",
          flexGrow: 1,
          flexDirection: "column",
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
    </View>
  );
};
