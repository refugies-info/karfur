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
import { Subscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "react-query";
import * as Linking from "expo-linking";
import { styles } from "../theme";

import { RootStackParamList } from "../../types";

import { markNotificationAsSeen } from "../utils/API";

import {
  getUserInfosActionCreator,
  saveSelectedLanguageActionCreator,
  setInitialUrlActionCreator,
} from "../services/redux/User/user.actions";
import {
  hasUserSeenOnboardingSelector,
  initialUrlSelector,
} from "../services/redux/User/user.selectors";
import { setUserHasNewFavoritesActionCreator } from "../services/redux/User/user.actions";
import { fetchNeedsActionCreator } from "../services/redux/Needs/needs.actions";

import BottomTabNavigator from "./BottomTabNavigator";
import { OnboardingStackNavigator } from "./OnboardingNavigator";
import { logEventInFirebase } from "../utils/logEvent";
import { FirebaseEvent } from "../utils/eventsUsedInFirebase";
import { themesSelector } from "../services/redux/Themes/themes.selectors";
import { fetchThemesActionCreator } from "../services/redux/Themes/themes.actions";
import { NotificationResponse } from "expo-notifications";
import {
  disableNotificationsListener,
  getNotificationFromStack,
  notificationDataStackLength,
} from "../libs/notifications";
import { getLocaleFromUrl } from "../libs/getScreenFromUrl";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const responseListener = useRef<Subscription>();
  const notificationsListener = useRef<Subscription>();
  const navigationRef = useRef<any>();
  const queryClient = useQueryClient();
  const [navigationReady, setNavigationReady] = useState(false);

  const hasUserSeenOnboarding = useSelector(hasUserSeenOnboardingSelector);
  const themes = useSelector(themesSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    // themes
    dispatch(fetchThemesActionCreator());

    // favorites
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
    dispatch(getUserInfosActionCreator());
    dispatch(fetchNeedsActionCreator());
  }, []);

  // Initial URL
  const initialUrl = useSelector(initialUrlSelector);
  useEffect(() => {
    const saveInitialUrl = (event: Linking.EventType | string | null) => {
      if (event) {
        let url = typeof event === "object" ? event.url : event;
        if (!url.includes("refugies.info")) return;
        dispatch(
          saveSelectedLanguageActionCreator({
            langue: getLocaleFromUrl(url),
            shouldFetchContents: false,
          })
        );
        dispatch(setInitialUrlActionCreator(url));
      }
    };

    const emitter = Linking.addEventListener("url", (event) =>
      saveInitialUrl(event)
    );
    Linking.getInitialURL().then(saveInitialUrl);

    return emitter.remove;
  }, []);

  //Notifications listener
  const handleNotification = async (
    response: NotificationResponse | null | undefined
  ) => {
    if (!response) return;
    switch (response?.notification?.request?.content?.data?.type) {
      case "dispositif": {
        logEventInFirebase(FirebaseEvent.OPEN_NOTIFICATION, {
          contentId: response.notification.request.content.data.contentId,
        });

        navigationRef?.current.navigate("Explorer", {
          screen: "ContentScreen",
          params: {
            contentId: response.notification.request.content.data.contentId,
          },
        });
        await markNotificationAsSeen({
          notificationId: response.notification.request.content.data
            .notificationId as string,
        });
        queryClient.invalidateQueries("notifications");
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (navigationReady) {
      // get initial notif. Read issue for more informations https://github.com/expo/expo/issues/14078#issuecomment-1041294084
      while (notificationDataStackLength() > 0) {
        handleNotification(getNotificationFromStack());
      }
      disableNotificationsListener();

      // Listener for app backgrounded
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) =>
          handleNotification(response)
        );

      // Listener for app is foregrounded
      notificationsListener.current =
        Notifications.addNotificationReceivedListener(() => {
          queryClient.invalidateQueries("notifications");
        });
    }

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }

      if (notificationsListener.current) {
        Notifications.removeNotificationSubscription(
          notificationsListener.current
        );
      }
    };
  }, [navigationReady]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (themes.length === 0 || hasUserSeenOnboarding === null) {
    return null;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: styles.colors.white,
    },
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      onReady={() => setNavigationReady(true)}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasUserSeenOnboarding && !initialUrl ? (
          <Stack.Screen
            name="OnboardingNavigator"
            component={OnboardingStackNavigator}
          />
        ) : (
          <Stack.Screen name="Root" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
