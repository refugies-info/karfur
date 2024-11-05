import AsyncStorage from "@react-native-async-storage/async-storage";
import crashlytics from "@react-native-firebase/crashlytics";
import Constants from "expo-constants";
import { getExpoPushTokenAsync } from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import { I18nManager, View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import aa from "search-insights";
import { RootNavigator } from "./navigation";
import { store } from "./services/redux/store";

import useAsync from "react-use/lib/useAsync";
import { ConnexionTest } from "./components/ConnexionTest";
import OfflinePage from "./components/OfflinePage";
import { ThemeProvider } from "./theme";
import { retrieveTechnicalInfo, updateAppUser } from "./utils/API";
// deactivate native RTL so we can handle it ourselves
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const queryClient = new QueryClient();

aa("init", {
  appId: "L9HYT1676M",
  apiKey: process.env.ALGOLIA_API_KEY || "",
});

const updateUserInfo = async () => {
  const [selectedLanguage, city, department, age, frenchLevel] = await Promise.all([
    AsyncStorage.getItem("SELECTED_LANGUAGE").then((result) => result || "fr"),
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
      projectId: Constants.expoConfig?.extra?.eas.projectId || "@refugies-info/refugies-info-app",
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

  useEffect(() => {
    updateUserInfo();
  }, []);

  if (loading) return null;

  /**
   * The app must be upgraded to continue
   */
  if (error) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <OfflinePage />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Suspense fallback={<View>Chargement</View>}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider>
              <RootNavigator />
              <ConnexionTest />
              <StatusBar />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}
