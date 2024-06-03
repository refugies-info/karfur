import * as React from "react";
import { ProfileParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { useSelector, useDispatch } from "react-redux";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import { activatedLanguages } from "../../data/languagesData";
import { LanguageDetailsButton } from "../../components";
import { Page, Rows, RowsSpacing, Title } from "../../components";
import { Languages } from "@refugies-info/api-types";
import { useTheme } from "styled-components/native";

export const LangueProfilScreen = ({
  navigation,
}: StackScreenProps<ProfileParamList, "LangueProfilScreen">) => {
  const { t, i18n } = useTranslationWithRTL();
  const theme = useTheme();
  const selectedLanguageI18nCode = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();

  const changeLanguage = (ln: Languages) => {
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
    <Page
      headerTitle={t("profile_screens.my_language", "Langue choisie")}
      headerIconName="globe-2-outline"
      hideLanguageSwitch
      backgroundColor={theme.colors.dsfr_backgroundBlue}
      headerBackgroundColor={theme.colors.dsfr_backgroundBlue}
    >
      <Title>
        {t(
          "profile_screens.language_choice",
          "Choisis la langue de l’application"
        )}
      </Title>
      <Rows spacing={RowsSpacing.NoSpace}>
        {activatedLanguages.map((language, index) => (
          <LanguageDetailsButton
            isSelected={language.i18nCode === selectedLanguageI18nCode}
            key={index}
            langueFr={language.langueFr}
            langueLoc={language.langueLoc}
            onPress={() => changeLanguage(language.i18nCode)}
          />
        ))}
      </Rows>
    </Page>
  );
};
