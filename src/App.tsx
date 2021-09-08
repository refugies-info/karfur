import React, { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Suspense fallback={<View>Chargement</View>}>
      <Provider store={store}>
        <SafeAreaProvider>
          <RootNavigator />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    </Suspense>
  );
}
