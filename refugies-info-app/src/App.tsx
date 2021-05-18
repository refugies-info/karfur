import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Updates } from "expo";
import { I18nManager as RNI18nManager } from "react-native";
import i18n from "./services/i18n/index";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    i18n
      .init()
      .then(() => {
        const RNDir = RNI18nManager.isRTL ? "RTL" : "LTR";
        // RN doesn't always correctly identify native
        // locale direction, so we force it here.
        if (i18n.dir !== RNDir) {
          const isLocaleRTL = i18n.dir === "RTL";
          RNI18nManager.forceRTL(isLocaleRTL);
          // RN won't set the layout direction if we
          // don't restart the app's JavaScript.
          Updates.reloadFromCache();
        }
        setIsI18nInitialized(true);
      })
      .catch((error) => console.warn(error));
  });

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
