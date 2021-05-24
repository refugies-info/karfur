import { View, Button } from "react-native";
import * as React from "react";
import { Text } from "../../components/Themed";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";
import { useDispatch } from "react-redux";
import { t } from "../../services/i18n";

export const Onboarding2 = () => {
  const dispatch = useDispatch();
  const seeOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };

  return (
    <View>
      <Text>{t("Onboarding2.welcome", "trad not loaded")}</Text>
      <Button title="Démarrer" onPress={seeOnboarding} />
    </View>
  );
};
