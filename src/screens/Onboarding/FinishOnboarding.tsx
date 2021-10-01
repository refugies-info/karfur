import * as React from "react";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
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
import {
  userLocationSelector,
  userAgeSelector,
  userFrenchLevelSelector,
} from "../../services/redux/User/user.selectors";
import noInfo from "../../theme/images/onboarding/onboarding_noinfo.png";
import { Image, View, Dimensions } from "react-native";

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
  margin-top: ${(props: { marginTop: number | undefined }) =>
    props.marginTop ? props.marginTop : theme.margin * 2}px;
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

  const location = useSelector(userLocationSelector);
  const age = useSelector(userAgeSelector);
  const frenchLevel = useSelector(userFrenchLevelSelector);

  const hasUserEnteredInfos =
    !!frenchLevel || !!age || !!location.city || !!location.department;

  const windowWidth = Dimensions.get("window").width;

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
        {hasUserEnteredInfos ? (
          <LottieContainer>
            <LottieView
              source={require("../../theme/lottie/thumbs-up-emoji-animation.json")}
              autoPlay
              loop
            />
          </LottieContainer>
        ) : (
          <View>
            <Image
              source={noInfo}
              style={{
                width: windowWidth,
                resizeMode: "cover",
                maxHeight: windowWidth / 2.7,
              }}
            />
          </View>
        )}
        {hasUserEnteredInfos && (
          <StyledText>{t("Merci !", "Merci !")}</StyledText>
        )}
        <StyledText
          marginTop={hasUserEnteredInfos ? theme.margin * 2 : theme.margin * 6}
        >
          {hasUserEnteredInfos
            ? t(
                "Onboarding.end",
                "L’application est maintenant adaptée à ton profil."
              )
            : t(
                "Onboarding.end_noInfos",
                "Tu pourras renseigner ces informations plus tard en cliquant sur « Moi »."
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
