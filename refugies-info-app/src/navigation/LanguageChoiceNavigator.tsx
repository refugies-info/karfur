import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { LanguageChoiceParamList } from "../../types";
import { LanguageChoiceScreen } from "../screens/LanguageChoiceScreen";

const LanguageChoiceNavigator = createStackNavigator<LanguageChoiceParamList>();

export const LanguageChoiceStackNavigator = () => (
  <LanguageChoiceNavigator.Navigator>
    <LanguageChoiceNavigator.Screen
      name="LanguageChoice"
      component={LanguageChoiceScreen}
      options={{ headerTitle: "LanguageChoice" }}
    />
  </LanguageChoiceNavigator.Navigator>
);
