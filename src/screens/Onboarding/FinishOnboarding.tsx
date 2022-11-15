import * as React from "react";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import styled from "styled-components/native";
import { styles } from "../../theme";
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
import ArrowOnboarding from "../../theme/images/onboarding/arrow-onboarding.svg";
import { View, Dimensions } from "react-native";
import { logEventInFirebase } from "../../utils/logEvent";
import { FirebaseEvent } from "../../utils/eventsUsedInFirebase";
import { FakeTabBar } from "../../navigation/components/FakeTabBar";

const MainView = styled(SafeAreaView)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${styles.colors.darkBlue};

  padding-bottom: ${styles.margin * 3}px;
`;
const StyledText = styled(StyledTextBigBold)`
  color: ${styles.colors.white};
  text-align: center;
  margin-top: ${(props: { marginTop: number | undefined }) =>
    props.marginTop ? props.marginTop : styles.margin * 2}px;
  margin-bottom: ${styles.margin}px;
`;
const ElementsContainer = styled.ScrollView`
  display: flex;
  flex-direction: column;
  padding-horizontal: ${styles.margin * 3}px;
`;
const LottieContainer = styled.View`
  height: 100px;
  width: 100px;
`;
const FakeTabBarArrowContainer = styled.View`
  width: ${(props: { width: number }) => props.width}px;
  align-items: flex-end;
  margin-top: ${styles.margin * 2}px;
`;
const ButtonContainer = styled.View`
  padding-horizontal: ${styles.margin * 3}px;
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

  const fakeTabBarWidth = Dimensions.get("window").width * 0.9;

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
    <MainView>
      <HeaderWithBack />

      <ElementsContainer contentContainerStyle={{ alignItems: "center" }}>
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
            <FakeTabBar width={fakeTabBarWidth} />
            <FakeTabBarArrowContainer width={fakeTabBarWidth}>
              <ArrowOnboarding style={{ width: "100%" }} />
            </FakeTabBarArrowContainer>
          </View>
        )}
        {hasUserEnteredInfos && (
          <StyledText>
            {t("onboarding_screens.thank_you", "Merci !")}
          </StyledText>
        )}
        <StyledText
          marginTop={
            hasUserEnteredInfos ? styles.margin * 2 : styles.margin * 6
          }
        >
          {hasUserEnteredInfos
            ? t(
                "onboarding_screens.end",
                "L’application est maintenant adaptée à ton profil."
              )
            : t(
                "onboarding_screens.end_no_info",
                "Tu pourras renseigner ces informations plus tard en cliquant sur « Moi »."
              )}
        </StyledText>
      </ElementsContainer>
      <ButtonContainer>
        <CustomButton
          i18nKey="onboarding_screens.start_searching_button"
          defaultText="Démarrer"
          textColor={styles.colors.darkBlue}
          onPress={finishOnboarding}
          iconName="arrow-forward-outline"
        />
      </ButtonContainer>
    </MainView>
  );
};
