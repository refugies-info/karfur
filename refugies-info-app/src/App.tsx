import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar />
      </SafeAreaProvider>
    </Provider>
  );
}
