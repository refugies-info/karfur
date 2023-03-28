import React from "react";
import { useDispatch } from "react-redux";
import { saveSelectedLanguageActionCreator } from "../services/redux/User/user.actions";
import { LanguageDetailsButton } from "../components";
import { activatedLanguages } from "../data/languagesData";
import { useTranslationWithRTL } from "../hooks/useTranslationWithRTL";
import { OnboardingParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { Page } from "../components";
import { Languages } from "@refugies-info/api-types";

export const LanguageChoiceScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "LanguageChoice">) => {
  const { i18n, t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const changeLanguage = (ln: Languages) => {
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
