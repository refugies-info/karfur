import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { LanguageChoiceParamList } from "../../types";
import { LanguageChoiceScreen } from "../screens/LanguageChoiceScreen";

const LanguageChoiceNavigator = createStackNavigator<LanguageChoiceParamList>();

export const LanguageChoiceStackNavigator = () => (
  <LanguageChoiceNavigator.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <LanguageChoiceNavigator.Screen
      name="LanguageChoice"
      component={LanguageChoiceScreen}
    />
  </LanguageChoiceNavigator.Navigator>
);
