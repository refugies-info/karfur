import { createStackNavigator } from "@react-navigation/stack";
import { ProfilParamList } from "../../../types";
import React from "react";
import { ProfilScreen } from "../../screens/ProfilTab/ProfilScreen";
import { LangueProfilScreen } from "../../screens/ProfilTab/LangueProfilScreen";
import { AgeProfilScreen } from "../../screens/ProfilTab/AgeProfilScreen";
import { CityProfilScreen } from "../../screens/ProfilTab/CityProfilScreen";
import { FrenchLevelProfilScreen } from "../../screens/ProfilTab/FrenchLevelScreen";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ProfilStack = createStackNavigator<ProfilParamList>();

export const ProfilNavigator = () => (
  <ProfilStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfilStack.Screen name="ProfilScreen" component={ProfilScreen} />
    <ProfilStack.Screen
      name="LangueProfilScreen"
      component={LangueProfilScreen}
    />
    <ProfilStack.Screen name="AgeProfilScreen" component={AgeProfilScreen} />
    <ProfilStack.Screen name="CityProfilScreen" component={CityProfilScreen} />

    <ProfilStack.Screen
      name="FrenchLevelProfilScreen"
      component={FrenchLevelProfilScreen}
    />
  </ProfilStack.Navigator>
);
