import "react-native-gesture-handler";
import React, { Suspense, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { QueryClientProvider, QueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpoPushTokenAsync } from "expo-notifications";
import crashlytics from "@react-native-firebase/crashlytics";
import aa from "search-insights";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";

import { ConnexionTest } from "./components/ConnexionTest";
import { retrieveTechnicalInfo, updateAppUser } from "./utils/API";
import useAsync from "react-use/lib/useAsync";
import OfflinePage from "./components/OfflinePage";
import { ThemeProvider } from "./theme";

const queryClient = new QueryClient();

aa("init", {
  appId: "L9HYT1676M",
  apiKey: process.env.ALGOLIA_API_KEY || "",
});

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
  aa("setUserToken", token.replace(/[\[\]]/g, "_")); // characters [] invalid for algolia
};

export default function App() {
  const { loading, error } = useAsync(retrieveTechnicalInfo);
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    updateUserInfo();
  }, []);

  if (!isLoadingComplete || loading) {
    return null;
  }

  /**
   * The app must be upgraded to continue
   */
  if (error) {
    return <OfflinePage />;
  }

  return (
    <Suspense fallback={<View>Chargement</View>}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SafeAreaProvider>
            <ThemeProvider>
              <RootNavigator />
              <ConnexionTest />
              <StatusBar />
            </ThemeProvider>
          </SafeAreaProvider>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  );
}
