import * as React from "react";
import { View, Text, Button } from "react-native";
import { OnboardingParamList } from "../../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { SmallButton } from "../../components/SmallButton";
import { useDispatch } from "react-redux";
import { saveHasUserSeenOnboardingActionCreator } from "../../services/redux/User/user.actions";

export const FinishOnboarding = ({
  navigation,
}: StackScreenProps<OnboardingParamList, "FinishOnboarding">) => {
  const dispatch = useDispatch();
  const finishOnboarding = () => {
    try {
      dispatch(saveHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <SmallButton iconName="arrow-back-outline" onPress={navigation.goBack} />

      <Text>FinishOnboarding</Text>
      <Button title="commencer" onPress={finishOnboarding} />
    </View>
  );
};
