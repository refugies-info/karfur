import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { AsyncStorage } from "react-native";
import i18n from "./services/i18n/index";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const setLanguage = async () => {
      try {
        await i18n.init();

        try {
          const value = await AsyncStorage.getItem("SELECTED_LANGUAGE");
          if (value) {
            i18n.changeLanguage(value);
          }
        } catch (e) {
          // error reading value
        }
        setIsI18nInitialized(true);
      } catch (error) {
        console.warn(error);
      }
    };
    setLanguage();
  }, []);

  if (!isLoadingComplete || !isI18nInitialized) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    </Provider>
  );
}
