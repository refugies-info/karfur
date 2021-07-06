import * as React from "react";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import styled from "styled-components/native";
import { theme } from "../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../../components/CustomButton";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { StyledTextBigBold } from "../../components/StyledText";
import LottieView from "lottie-react-native";
import { fetchContentsActionCreator } from "../../services/redux/Contents/contents.actions";
import { HeaderWithBack } from "../../components/HeaderWithBack";

const MainView = styled(SafeAreaView)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${theme.colors.darkBlue};

  padding-bottom: ${theme.margin * 3}px;
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
  padding-horizontal: ${theme.margin * 3}px;
`;

const LottieContainer = styled.View`
  height: 100px;
  width: 100px;
`;

const ButtonContainer = styled.View`
  padding-horizontal: ${theme.margin * 3}px;
`;
export const FinishOnboarding = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FinishOnboarding">) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();
  const finishOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
      dispatch(fetchContentsActionCreator());
    } catch (e) {}
  };
  return (
    <MainView>
      <HeaderWithBack navigation={navigation} />

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
      <ButtonContainer>
        <CustomButton
          i18nKey="Démarrer"
          defaultText="Démarrer"
          textColor={theme.colors.darkBlue}
          onPress={finishOnboarding}
          iconName="arrow-forward-outline"
        />
      </ButtonContainer>
    </MainView>
  );
};
