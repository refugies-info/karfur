/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { RootStackParamList } from "../../types";
import BottomTabNavigator from "./BottomTabNavigator";
import i18n from "../services/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedLanguageActionCreator,
  setCurrentLanguageActionCreator,
} from "../services/redux/User/user.actions";
import { logger } from "../logger";
import { OnboardingStackNavigator } from "./OnboardingNavigator";
import {
  hasUserSeenOnboardingSelector,
  selectedI18nCodeSelector,
} from "../services/redux/User/user.selectors";
import {
  setHasUserSeenOnboardingActionCreator,
  setUserAgeActionCreator,
  setUserFrenchLevelActionCreator,
  setUserLocationActionCreator,
} from "../services/redux/User/user.actions";
import { LanguageChoiceStackNavigator } from "./LanguageChoiceNavigator";
import { theme } from "../theme";
import "../services/i18n";
import { initReactI18next } from "react-i18next";
import { AvailableLanguageI18nCode } from "../types/interface";

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
  const userSelectedLanguage = useSelector(selectedI18nCodeSelector);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const setLocation = async () => {
      try {
        const city = await AsyncStorage.getItem("CITY");
        const dep = await AsyncStorage.getItem("DEP");

        if (city && dep) {
          dispatch(setUserLocationActionCreator({ city, dep }));
        }
      } catch (error) {
        logger.error("Error while initializing location", {
          error: error.message,
        });
      }
    };

    const setAge = async () => {
      try {
        const age = await AsyncStorage.getItem("AGE");
        if (age) {
          dispatch(setUserAgeActionCreator(age));
        }
      } catch (error) {
        logger.error("Error while initializing age", {
          error: error.message,
        });
      }
    };

    const setFrenchLevel = async () => {
      try {
        const frenchLevel = await AsyncStorage.getItem("FRENCH_LEVEL");

        if (frenchLevel) {
          dispatch(setUserFrenchLevelActionCreator(frenchLevel));
        }
      } catch (error) {
        logger.error("Error while initializing french level", {
          error: error.message,
        });
      }
    };

    const setLanguage = async () => {
      try {
        i18n.use(initReactI18next);
        await i18n.init();
        try {
          // @ts-ignore
          const language: AvailableLanguageI18nCode | null = await AsyncStorage.getItem(
            "SELECTED_LANGUAGE"
          );
          if (language) {
            i18n.changeLanguage(language);
            dispatch(setSelectedLanguageActionCreator(language));
            dispatch(setCurrentLanguageActionCreator(language));
          } else {
            i18n.changeLanguage("fr");
          }
        } catch (e) {
          // error reading value
        }
        setIsI18nInitialized(true);
      } catch (error) {
        logger.error("Error while initializing i18n", {
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
    setLocation();
    setAge();
    setFrenchLevel();
  }, []);

  if (!isI18nInitialized || !isOnboardingValueInitialized) {
    return null;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.lightGrey,
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userSelectedLanguage ? (
          <Stack.Screen
            name="LanguageChoiceNavigator"
            component={LanguageChoiceStackNavigator}
          />
        ) : !hasUserSeenOnboarding ? (
          <Stack.Screen
            name="OnboardingNavigator"
            component={OnboardingStackNavigator}
          />
        ) : (
          <>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
