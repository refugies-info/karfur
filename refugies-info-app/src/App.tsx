import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { AsyncStorage } from "react-native";
import i18n from "./services/i18n/index";

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

            // value previously stored
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
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </SafeAreaProvider>
  );
}
