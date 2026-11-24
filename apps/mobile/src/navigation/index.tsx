/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DefaultTheme,
  NavigationContainer,
  type NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import type { EventSubscription, NotificationResponse } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { getLocaleFromUrl } from "~/libs/getScreenFromUrl";
import {
  disableNotificationsListener,
  getNotificationFromStack,
  notificationDataStackLength,
} from "~/libs/notifications";
import { fetchNeedsActionCreator } from "~/services/redux/Needs/needs.actions";
import { fetchThemesActionCreator } from "~/services/redux/Themes/themes.actions";
import { themesSelector } from "~/services/redux/Themes/themes.selectors";
import {
  getUserInfosActionCreator,
  saveSelectedLanguageActionCreator,
  setInitialUrlActionCreator,
  setUserHasNewFavoritesActionCreator,
} from "~/services/redux/User/user.actions";
import {
  hasUserSeenOnboardingSelector,
  initialUrlSelector,
} from "~/services/redux/User/user.selectors";
import { styles } from "~/theme";
import type { RootStackParamList } from "~/types/navigation";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";
import type { RootStackParamList as NavigationRootStackParamList } from "../types/navigation";
import BottomTabNavigator from "./BottomTabNavigator";
import { OnboardingStackNavigator } from "./OnboardingNavigator";

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const responseListener = useRef<EventSubscription | undefined>(undefined);
  const notificationsListener = useRef<EventSubscription | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<NavigationRootStackParamList>>(null);
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
      } catch (_: unknown) {
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
        const url = typeof event === "object" ? event.url : event;
        if (!url.includes("refugies.info") && !url.startsWith("refugies://")) return;
        dispatch(
          saveSelectedLanguageActionCreator({
            langue: getLocaleFromUrl(url),
            shouldFetchContents: false,
          }),
        );
        dispatch(setInitialUrlActionCreator(url));
      }
    };

    const emitter = Linking.addEventListener("url", (event) => saveInitialUrl(event));
    Linking.getInitialURL().then(saveInitialUrl);

    return emitter.remove;
  }, []);

  //Notifications listener
  const handleNotification = async (response: NotificationResponse | null | undefined) => {
    if (!response) return;
    logEventInFirebase(FirebaseEvent.OPEN_NOTIFICATION, {
      contentId: response.notification.request.content.data?.contentId,
    });
    queryClient.invalidateQueries("notifications");

    // Nested navigation is not covered by the root param list types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigation = navigationRef.current as any;
    navigation.navigate("Root");
    // Let the Root tabs mount before targeting a nested screen.
    setTimeout(() => {
      navigation.navigate("Explorer", { screen: "NotificationsScreen", params: {} });
    }, 100);
  };

  useEffect(() => {
    if (navigationReady) {
      // get initial notif. Read issue for more informations https://github.com/expo/expo/issues/14078#issuecomment-1041294084
      const launchResponses = [Notifications.getLastNotificationResponse()];
      while (notificationDataStackLength() > 0) {
        launchResponses.push(getNotificationFromStack() ?? null);
      }
      disableNotificationsListener();
      // The early listener misses the launching click on cold start; both sources can hold the same one.
      Notifications.clearLastNotificationResponse();
      const handledIds = new Set<string>();
      for (const response of launchResponses) {
        const id = response?.notification.request.identifier;
        if (!response || !id || handledIds.has(id)) continue;
        handledIds.add(id);
        handleNotification(response);
      }

      // Listener for app backgrounded
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) =>
        handleNotification(response),
      );

      // Listener for app is foregrounded
      notificationsListener.current = Notifications.addNotificationReceivedListener(() => {
        queryClient.invalidateQueries("notifications");
      });
    }

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }

      if (notificationsListener.current) {
        notificationsListener.current.remove();
      }
    };
  }, [navigationReady]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
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
          <Stack.Screen name="OnboardingNavigator" component={OnboardingStackNavigator} />
        ) : (
          <Stack.Screen name="Root" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
