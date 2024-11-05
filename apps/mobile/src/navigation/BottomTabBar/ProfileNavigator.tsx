import { createStackNavigator } from "@react-navigation/stack";
import { AboutScreen } from "~/screens/ProfilTab/AboutScreen";
import { AccessibilityScreen } from "~/screens/ProfilTab/AccessibilityScreen";
import { AgeProfilScreen } from "~/screens/ProfilTab/AgeProfilScreen";
import { CityProfilScreen } from "~/screens/ProfilTab/CityProfilScreen";
import { FrenchLevelProfilScreen } from "~/screens/ProfilTab/FrenchLevelProfilScreen";
import { LangueProfilScreen } from "~/screens/ProfilTab/LangueProfilScreen";
import { LegalNoticeScreen } from "~/screens/ProfilTab/LegalNoticeScreen";
import { NotificationsSettingsScreen } from "~/screens/ProfilTab/NotificationsSettingsScreen";
import { PrivacyPolicyScreen } from "~/screens/ProfilTab/PrivacyPolicyScreen";
import { ProfilScreen } from "~/screens/ProfilTab/ProfilScreen";
import { ShareScreen } from "~/screens/ProfilTab/ShareScreen";
import { ProfileParamList } from "~/types/navigation";

const ProfileStack = createStackNavigator<ProfileParamList>();

export const ProfileNavigator = () => (
  <ProfileStack.Navigator initialRouteName="ProfilScreen" screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfilScreen" component={ProfilScreen} />
    <ProfileStack.Screen name="LangueProfilScreen" component={LangueProfilScreen} />
    <ProfileStack.Screen name="AgeProfilScreen" component={AgeProfilScreen} />
    <ProfileStack.Screen name="CityProfilScreen" component={CityProfilScreen} />
    <ProfileStack.Screen name="FrenchLevelProfilScreen" component={FrenchLevelProfilScreen} />
    <ProfileStack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
    <ProfileStack.Screen name="LegalNoticeScreen" component={LegalNoticeScreen} />
    <ProfileStack.Screen name="AboutScreen" component={AboutScreen} />
    <ProfileStack.Screen name="AccessibilityScreen" component={AccessibilityScreen} />
    <ProfileStack.Screen name="NotificationsSettingsScreen" component={NotificationsSettingsScreen} />
    <ProfileStack.Screen name="ShareScreen" component={ShareScreen} />
  </ProfileStack.Navigator>
);
