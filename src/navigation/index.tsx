/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useState, useRef, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { initReactI18next } from "react-i18next";
import { Subscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "react-query";

import { logger } from "../logger";
import { theme } from "../theme";

import { AvailableLanguageI18nCode } from "../types/interface";
import { RootStackParamList } from "../../types";

import { markNotificationAsSeen } from "../utils/API";

import i18n from "../services/i18n";
import { getUserInfosActionCreator } from "../services/redux/User/user.actions";
import { hasUserSeenOnboardingSelector } from "../services/redux/User/user.selectors";
import { setUserHasNewFavoritesActionCreator } from "../services/redux/User/user.actions";
import "../services/i18n";
import { fetchNeedsActionCreator } from "../services/redux/Needs/needs.actions";

import BottomTabNavigator from "./BottomTabNavigator";
import { OnboardingStackNavigator } from "./OnboardingNavigator";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const responseListener = useRef<Subscription>();
  const navigationRef = useRef<any>();
  const queryClient = useQueryClient();

  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    const setLanguage = async () => {
      try {
        i18n.use(initReactI18next);
        await i18n.init();
        try {
          // @ts-ignore
          const language: AvailableLanguageI18nCode | null =
            await AsyncStorage.getItem("SELECTED_LANGUAGE");
          if (language) {
            i18n.changeLanguage(language);
          } else {
            i18n.changeLanguage("fr");
          }
        } catch (e) {
          // error reading value
        }
        setIsI18nInitialized(true);
      } catch (error) {
        logger.error("Error while initializing i18n", {
          //@ts-expect-error
          error: error.message,
        });
      }
    };

    const checkIfUserHasNewFavorites = async () => {
      try {
        const value = await AsyncStorage.getItem("HAS_USER_NEW_FAVORITES");

        const hasUserNewFavorites = value === "TRUE";
        if (hasUserNewFavorites) {
          dispatch(setUserHasNewFavoritesActionCreator(true));
        }
      } catch (e) {
        // error reading value
      }
    };
    checkIfUserHasNewFavorites();
    setLanguage();
    dispatch(getUserInfosActionCreator());
    dispatch(fetchNeedsActionCreator());
  }, []);

  //Notifications listener
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          switch (response?.notification?.request?.content?.data?.type) {
            case "dispositif": {
              navigationRef?.current.navigate("Explorer", {
                screen: "ContentScreen",
                params: {
                  contentId:
                    response.notification.request.content.data.contentId,
                },
              });
              await markNotificationAsSeen(
                response.notification.request.content.data
                  .notificationId as string
              );
              queryClient.invalidateQueries("notifications");
            }
            default:
              break;
          }
        }
      );

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (!isI18nInitialized || hasUserSeenOnboarding === null) {
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
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasUserSeenOnboarding ? (
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
