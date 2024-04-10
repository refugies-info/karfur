import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import { LanguageDetailsButton } from "../components";
import { activatedLanguages } from "../data/languagesData";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { OnboardingParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { Page } from "../components";
import { Languages } from "@refugies-info/api-types";
import { selectedI18nCodeSelector } from "../services/redux/User/user.selectors";

export const LanguageChoiceScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "LanguageChoice">) => {
  const { i18n, t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  // when language selected (or if already selected), navigate to next screen
  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  useEffect(() => {
    if (selectedLanguage) navigation.navigate("OnboardingStart");
  }, [navigation, selectedLanguage]);

  const changeLanguage = (ln: Languages) => {
    i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: false,
      })
    );
  };
  return (
    <Page
      headerIconName="globe-2-outline"
      headerTitle={t("global.language", "Langue")}
      hideLanguageSwitch
      showLogo
    >
      {activatedLanguages.map((language, index) => (
        <LanguageDetailsButton
          hideRadio
          key={index}
          langueFr={language.langueFr}
          langueLoc={language.langueLoc}
          onPress={() => changeLanguage(language.i18nCode)}
        />
      ))}
    </Page>
  );
};
