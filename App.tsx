import React from "react";
import { initReactI18next } from "react-i18next";
import { Languages } from "@refugies-info/api-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import i18n from "./src/services/i18n";
import { logger } from "./src/logger";
import { enableNotificationsListener } from "./src/libs/notifications";
import MainApp from "./src/App";
import useAsync from "react-use/lib/useAsync";
import { Text } from "react-native";

enableNotificationsListener();

export default function App() {
  const { loading, error } = useAsync(async () => {
    try {
      i18n.use(initReactI18next);
      await i18n.init();
      try {
        const language =
          ((await AsyncStorage.getItem("SELECTED_LANGUAGE")) as Languages) ||
          ("fr" as Languages);
        if (language) {
          i18n.changeLanguage(language);
        } else {
          i18n.changeLanguage("fr");
        }
      } catch (e) {
        // error reading value
        logger.error("Failed to setup the language");
        throw e;
      }
    } catch (error: any) {
      logger.error("Error while initializing i18n", {
        error: error.message,
      });
      throw error;
    }
  }, []);

  if (loading || error) {
    return <Text>Loading</Text>;
  }
  return <MainApp />;
}
