import "react-native-gesture-handler";
import React, { Suspense, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Host } from "react-native-portalize";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import "react-native-get-random-values"; // Needed before uuid import according to their docs
import { v4 as uuidv4 } from "uuid";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";

import { ConnexionTest } from "./components/ConnexionTest";
import { updateAppUser } from "./utils/API";

const UID_STORAGE_KEY = "uid";

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const responseListener = useRef<Subscription>();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        //TODO : notifications
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  useEffect(() => {
    const createUid = async () => {
      const exists = await AsyncStorage.getItem(UID_STORAGE_KEY);
      if (!exists) {
        const uid = uuidv4();
        await AsyncStorage.setItem(UID_STORAGE_KEY, uid);
      }
      const token = await registerForPushNotificationsAsync();
      if (token) {
        updateAppUser({
          expoPushToken: token,
        });
      }
    };

    createUid();

    //     This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // TODO ADD NAVIGFATION HANDLER HERE
    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log(response);
    //   });

    // return () => {
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  // useEffect(() => {

  //   const getToken = async () => {
  //     const token = await Notifications.getExpoPushTokenAsync();
  //     if (token) {
  //       //send
  //     }

  //   }

  //   getToken()

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   //TODO ADD NAVIGFATION HANDLER HERE
  //   // responseListener.current =
  //   //   Notifications.addNotificationResponseReceivedListener((response) => {
  //   //     console.log(response);
  //   //   });

  //   // return () => {
  //   //   Notifications.removeNotificationSubscription(responseListener.current);
  //   // };
  // }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Suspense fallback={<View>Chargement</View>}>
      <Provider store={store}>
        <SafeAreaProvider>
          {/*
            TODO: Fix for https://github.com/software-mansion/react-native-gesture-handler/issues/139
            Remove when this released https://github.com/software-mansion/react-native-gesture-handler/pull/1603
          */}
          <Host>
            <RootNavigator />
            <ConnexionTest />
          </Host>
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    </Suspense>
  );
}
