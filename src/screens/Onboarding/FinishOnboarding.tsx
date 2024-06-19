import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { View, Dimensions } from "react-native";
import styled from "styled-components/native";
import LottieView from "lottie-react-native";
import { OnboardingParamList } from "../../../types";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import { styles } from "../../theme";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";
import { TextDSFR_XL } from "../../components/StyledText";
import { fetchContentsActionCreator } from "../../services/redux/Contents/contents.actions";
import {
  userLocationSelector,
  userAgeSelector,
  userFrenchLevelSelector,
} from "../../services/redux/User/user.selectors";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { FakeTabBar } from "../../navigation/components/FakeTabBar";
import { ButtonDSFR, ReadableText, Spacer } from "../../components";
import PageOnboarding from "../../components/layout/PageOnboarding";
import EndOnboardingIllu from "../../theme/images/onboarding/end-onboarding-illu.svg";

const Title = styled(TextDSFR_XL)`
  color: ${({ theme }) => theme.colors.dsfr_action};
`;
const Container = styled.View`
  align-items: center;
  margin-bottom: 15%;
`;
const LottieContainer = styled.View`
  position: relative;
  height: 350px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const FakeTabBarArrowContainer = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  align-items: flex-end;
  margin-top: ${styles.margin * 2}px;
`;

export const FinishOnboarding = ({}: StackScreenProps<
  OnboardingParamList,
  "FinishOnboarding"
>) => {
  const { t } = useTranslationWithRTL();
  const dispatch = useDispatch();

  const location = useSelector(userLocationSelector);
  const age = useSelector(userAgeSelector);
  const frenchLevel = useSelector(userFrenchLevelSelector);

  // TODO: restore when design ready
  const hasUserEnteredInfos =
    true; /* !!frenchLevel || !!age || !!location.city || !!location.department; */

  const fakeTabBarWidth = Dimensions.get("screen").width * 0.88;

  const finishOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
      dispatch(fetchContentsActionCreator());
      logEventInFirebase(
        hasUserEnteredInfos
          ? FirebaseEvent.PROFILE_COMPLETED
          : FirebaseEvent.PROFILE_NOT_COMPLETED,
        {}
      );
    } catch (e) {}
  };
  return (
    <PageOnboarding darkBackground>
      <Container>
        {hasUserEnteredInfos ? (
          <LottieContainer>
            <EndOnboardingIllu width={164} height={180} style={{ zIndex: 2 }} />
            <LottieView
              source={require("../../theme/lottie/onboarding-animation.json")}
              autoPlay
              loop
              style={{
                position: "absolute",
                zIndex: 1,
                width: "110%",
                height: "110%",
                top: "-5%",
                left: "-3%",
              }}
            />
          </LottieContainer>
        ) : (
          <View>
            <FakeTabBar width={fakeTabBarWidth} />
            <FakeTabBarArrowContainer width={fakeTabBarWidth} />
          </View>
        )}
        <Title>
          <ReadableText>
            {hasUserEnteredInfos
              ? t("onboarding_screens.ready")
              : t(
                  "onboarding_screens.end_no_info",
                  "Tu pourras renseigner ces informations plus tard en cliquant sur « Moi »."
                )}
          </ReadableText>
        </Title>
      </Container>
      <ButtonDSFR
        title={t("onboarding_screens.start")}
        accessibilityLabel={t("onboarding_screens.start")}
        onPress={finishOnboarding}
        priority="primary"
        iconName="arrow-forward-outline"
        iconAfter
        style={{ width: "100%" }}
      />
      <Spacer height={50} />
    </PageOnboarding>
  );
};
