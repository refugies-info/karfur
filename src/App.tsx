import "react-native-gesture-handler";
import React, { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import { RootNavigator } from "./navigation";
import { Provider } from "react-redux";
import { store } from "./services/redux/store";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Host } from "react-native-portalize";
import { ConnexionTest } from "./components/ConnexionTest";

export default function App() {
  const isLoadingComplete = useCachedResources();

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
