import { View, Button, AsyncStorage } from "react-native";
import * as React from "react";
import { Text } from "../components/Themed";
import { useDispatch } from "react-redux";
import { setHasUserSeenOnboardingActionCreator } from "../services/redux/User/user.actions";

export const LanguageChoiceScreen = (props: any) => {
  const dispatch = useDispatch();
  const seeOnboarding = () => {
    try {
      AsyncStorage.setItem("HAS_USER_SEEN_ONBOARDING", "TRUE");
      dispatch(setHasUserSeenOnboardingActionCreator());
    } catch (e) {}
  };
  return (
    <View>
      <Text>Text</Text>
      <Button onPress={seeOnboarding} title="see onboarding" />

      <Button
        onPress={() => {
          props.navigation.navigate("NotFound");
        }}
        title="nav"
      />
    </View>
  );
};
