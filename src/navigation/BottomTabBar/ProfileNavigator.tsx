import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ProfileParamList } from "../../../types";
import { ProfilScreen } from "../../screens/ProfilTab/ProfilScreen";
import { LangueProfilScreen } from "../../screens/ProfilTab/LangueProfilScreen";
import { AgeProfilScreen } from "../../screens/ProfilTab/AgeProfilScreen";
import { CityProfilScreen } from "../../screens/ProfilTab/CityProfilScreen";
import { FrenchLevelProfilScreen } from "../../screens/ProfilTab/FrenchLevelProfilScreen";
import { PrivacyPolicyScreen } from "../../screens/ProfilTab/PrivacyPolicyScreen";
import { AboutScreen } from "../../screens/ProfilTab/AboutScreen";

const ProfileStack = createStackNavigator<ProfileParamList>();

export const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen
      name="ProfilScreen"
      component={ProfilScreen}
    />
    <ProfileStack.Screen
      name="LangueProfilScreen"
      component={LangueProfilScreen}
    />
    <ProfileStack.Screen
      name="AgeProfilScreen"
      component={AgeProfilScreen}
    />
    <ProfileStack.Screen
      name="CityProfilScreen"
      component={CityProfilScreen}
    />
    <ProfileStack.Screen
      name="FrenchLevelProfilScreen"
      component={FrenchLevelProfilScreen}
    />
    <ProfileStack.Screen
      name="PrivacyPolicyScreen"
      component={PrivacyPolicyScreen}
    />
    <ProfileStack.Screen
      name="AboutScreen"
      component={AboutScreen}
    />
  </ProfileStack.Navigator>
);
