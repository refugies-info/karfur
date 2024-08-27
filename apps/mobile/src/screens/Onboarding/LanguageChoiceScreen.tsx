import { StackScreenProps } from "@react-navigation/stack";
import { Languages } from "@refugies-info/api-types";
import { useEffect } from "react";
import { Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { LanguageDetailsButton } from "~/components";
import PageOnboarding from "~/components/layout/PageOnboarding";
import { activatedLanguages } from "~/data/languagesData";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { saveSelectedLanguageActionCreator } from "~/services/redux/User/user.actions";
import { selectedI18nCodeSelector } from "~/services/redux/User/user.selectors";
import HelloIllu from "~/theme/images/onboarding/hello.png";
import { OnboardingParamList } from "~/types/navigation";

const ImageContainer = styled.View`
  margin-top: ${({ theme }) => theme.margin * 2}px;
  margin-bottom: ${({ theme }) => theme.margin * 4}px;
  justify-content: center;
  align-items: center;
`;

export const LanguageChoiceScreen = ({ navigation }: StackScreenProps<OnboardingParamList, "LanguageChoice">) => {
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
      }),
    );
    navigation.navigate("OnboardingSteps"); // needed in case we re-select same language
  };
  return (
    <PageOnboarding hideNavbar>
      <ImageContainer>
        <Image source={HelloIllu} width={80} height={80} alt="" style={{ width: 80, height: 80 }} />
      </ImageContainer>
      {activatedLanguages.map((language, index) => (
        <LanguageDetailsButton
          hideRadio
          iconOverride="chevron-right-outline"
          key={index}
          langueFr={language.langueFr}
          langueLoc={language.langueLoc}
          langueCode={language.i18nCode}
          onPress={() => changeLanguage(language.i18nCode)}
        />
      ))}
    </PageOnboarding>
  );
};
