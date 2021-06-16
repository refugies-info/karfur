import * as React from "react";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SmallButton } from "../../components/SmallButton";
import { useDispatch } from "react-redux";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../../components/CustomButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextBigBold } from "../../components/StyledText";
import LottieView from "lottie-react-native";

const MainView = styled(SafeAreaView)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${theme.colors.darkBlue};
  padding-horizontal: ${theme.margin * 3}px;
  padding-bottom: ${theme.margin * 3}px;

  padding-top: ${theme.margin}px;
`;

const TopButtonsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const StyledText = styled(StyledTextBigBold)`
  color: ${theme.colors.white};
  text-align: center;
  margin-top: ${theme.margin * 2}px;
  margin-bottom: ${theme.margin}px;
`;

const ElementsContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LottieContainer = styled.View`
  height: 100px;
  width: 100px;
`;
export const FinishOnboarding = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FinishOnboarding">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();
  const finishOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };
  return (
    <MainView>
      <TopButtonsContainer>
        <SmallButton
          iconName="arrow-back-outline"
          onPress={navigation.goBack}
        />
        <SmallButton iconName="volume-up-outline" />
      </TopButtonsContainer>
      <ElementsContainer>
        <LottieContainer>
          <LottieView
            source={require("../../theme/lottie/thumbs-up-emoji-animation.json")}
            autoPlay
            loop
          />
        </LottieContainer>
        <StyledText>{t("Merci !", "Merci !")}</StyledText>
        <StyledText>
          {t(
            "onboarding.end",
            "L’application est maintenant adaptée à ton profil."
          )}
        </StyledText>
      </ElementsContainer>
      <CustomButton
        i18nKey="Démarrer"
        defaultText="Démarrer"
        textColor={theme.colors.darkBlue}
        onPress={finishOnboarding}
        iconName="arrow-forward-outline"
      />
    </MainView>
  );
};
