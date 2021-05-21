/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../../types";
import BottomTabNavigator from "./BottomTabNavigator";
import i18n from "../services/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLanguageActionCreator } from "../services/redux/Languages/languages.actions";
import { logger } from "../logger";
import { OnboardingStackNavigator } from "./OnboardingNavigator";
import { hasUserSeenOnboardingSelector } from "../services/redux/User/user.selectors";
import { setHasUserSeenOnboardingActionCreator } from "../services/redux/User/user.actions";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [isI18nInitialized, setIsI18nInitialized] = React.useState(false);
  const [
    isOnboardingValueInitialized,
    setIsOnboardingValueInitialized,
  ] = React.useState(false);

  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);

  const dispatch = useDispatch();
  React.useEffect(() => {
    const setLanguage = async () => {
      try {
        await i18n.init();
        try {
          const value = await AsyncStorage.getItem("SELECTED_LANGUAGE");
          if (value) {
            i18n.changeLanguage(value);
            dispatch(setSelectedLanguageActionCreator(value));
          } else {
            i18n.changeLanguage("fr");
          }
        } catch (e) {
          // error reading value
        }
        setIsI18nInitialized(true);
      } catch (error) {
        logger.warn("Error while initializing i18n", {
          error: error.message,
        });
      }
    };

    const checkIfUserHasAlreadySeenOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("HAS_USER_SEEN_ONBOARDING");

        const hasUserAlreadySeenOnboarding = value === "TRUE";
        if (hasUserAlreadySeenOnboarding) {
          dispatch(setHasUserSeenOnboardingActionCreator());
        }

        setIsOnboardingValueInitialized(true);
      } catch (e) {
        // error reading value
      }
    };
    checkIfUserHasAlreadySeenOnboarding();
    setLanguage();
  }, [hasUserSeenOnboarding]);

  if (!isI18nInitialized || !isOnboardingValueInitialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasUserSeenOnboarding ? (
          <Stack.Screen
            name="RootOnboarding"
            component={OnboardingStackNavigator}
          />
        ) : (
          <>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: "Oops!" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
