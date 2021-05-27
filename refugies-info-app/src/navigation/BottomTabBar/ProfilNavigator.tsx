import { createStackNavigator } from "@react-navigation/stack";
import { ProfilParamList } from "../../../types";
import React from "react";
import { ProfilScreen } from "../../screens/ProfilTab/ProfilScreen";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ProfilStack = createStackNavigator<ProfilParamList>();

export const ProfilNavigator = () => (
  <ProfilStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfilStack.Screen name="ProfilScreen" component={ProfilScreen} />
  </ProfilStack.Navigator>
);
