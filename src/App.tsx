import "react-native-gesture-handler";
import React, { Suspense, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { QueryClientProvider, QueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpoPushTokenAsync } from "expo-notifications";
import crashlytics from "@react-native-firebase/crashlytics";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";

import { ConnexionTest } from "./components/ConnexionTest";
import { updateAppUser } from "./utils/API";

const queryClient = new QueryClient();

const updateUserInfo = async () => {
  const [selectedLanguage, city, department, age, frenchLevel] =
    await Promise.all([
      AsyncStorage.getItem("SELECTED_LANGUAGE"),
      AsyncStorage.getItem("CITY"),
      AsyncStorage.getItem("DEP"),
      AsyncStorage.getItem("AGE"),
      AsyncStorage.getItem("FRENCH_LEVEL"),
    ]);
  const payload: any = {
    selectedLanguage,
    city,
    department,
    age,
    frenchLevel,
  };
  const token = (
    await getExpoPushTokenAsync({
      experienceId: "@refugies-info/refugies-info-app",
    })
  ).data;
  if (token) {
    payload.expoPushToken = token;
  }
  updateAppUser(payload);
  crashlytics().setUserId(token);
  crashlytics().crash();
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    updateUserInfo();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Suspense fallback={<View>Chargement</View>}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SafeAreaProvider>
            <RootNavigator />
            <ConnexionTest />
            <StatusBar />
          </SafeAreaProvider>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  );
}
