import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import styled from "styled-components/native";
import { Languages } from "@refugies-info/api-types";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { LanguageDetailsButton } from "../../components";
import { activatedLanguages } from "../../data/languagesData";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import PageOnboarding from "../../components/layout/PageOnboarding";
import { selectedI18nCodeSelector } from "../../services/redux/User/user.selectors";
import HelloIllu from "../../theme/images/onboarding/hello.png";

const ImageContainer = styled.View`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 4}px;
  justify-content: center;
  align-items: center;
`;

export const LanguageChoiceScreen = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "LanguageChoice">) => {
  const { i18n } = useTranslationWithRTL();
  const dispatch = useDispatch();

  // when language selected (or if already selected), navigate to next screen
  const selectedLanguage = useSelector(selectedI18nCodeSelector);
  useEffect(() => {
    if (selectedLanguage) navigation.navigate("OnboardingSteps");
  }, [navigation, selectedLanguage]);

  const changeLanguage = async (ln: Languages) => {
    await i18n.changeLanguage(ln);
    dispatch(
      saveSelectedLanguageActionCreator({
        langue: ln,
        shouldFetchContents: false,
      })
    );
    navigation.navigate("OnboardingSteps"); // needed in case we re-select same language
  };
  return (
    <PageOnboarding hideNavbar>
      <ImageContainer>
        <Image
          source={HelloIllu}
          width={80}
          height={80}
          alt=""
          style={{ width: 80, height: 80 }}
        />
      </ImageContainer>
      {activatedLanguages.map((language, index) => (
        <LanguageDetailsButton
          hideRadio
          iconOverride="chevron-right-outline"
          key={index}
          langueFr={language.langueFr}
          langueLoc={language.langueLoc}
          onPress={() => changeLanguage(language.i18nCode)}
        />
      ))}
    </PageOnboarding>
  );
};
