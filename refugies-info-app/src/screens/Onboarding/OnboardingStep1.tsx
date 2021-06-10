import { View, Button } from "react-native";
import * as React from "react";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import { useDispatch } from "react-redux";
import { t } from "../../services/i18n";
import { Header } from "../../components/Header";
import { TextNormal } from "../../components/StyledText";

export const OnboardingStep1 = () => {
  const dispatch = useDispatch();
  const seeOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };

  return (
    <View>
      <Header />
      <TextNormal>
        {t("Onboarding1.welcome", "onboarding1 trad not loaded")}
      </TextNormal>
      <Button title="Démarrer" onPress={seeOnboarding} />
    </View>
  );
};
