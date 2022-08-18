import "react-native-gesture-handler";
import React, { Suspense, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Host } from "react-native-portalize";
import { QueryClientProvider, QueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpoPushTokenAsync } from "expo-notifications";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./services/redux/store";

import { ConnexionTest } from "./components/ConnexionTest";
import { updateAppUser } from "./utils/API";
import { fetchThemesActionCreator } from "./services/redux/Themes/themes.actions";
import { themesSelector } from "./services/redux/Themes/themes.selectors";

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
  const token = (await getExpoPushTokenAsync()).data;
  if (token) {
    payload.expoPushToken = token;
  }
  updateAppUser(payload);
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const dispatch = useDispatch();
  const themes = useSelector(themesSelector);

  useEffect(() => {
    dispatch(fetchThemesActionCreator());
    updateUserInfo();
  }, []);

  if (!isLoadingComplete && themes.length > 0) {
    return null;
  }

  return (
    <Suspense fallback={<View>Chargement</View>}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Suspense>
  );
}
