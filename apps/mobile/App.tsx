import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Languages } from "@refugies-info/api-types";
import * as Sentry from "@sentry/react-native";
import * as Updates from "expo-updates";
import { initReactI18next } from "react-i18next";
import { Text } from "react-native";
import useAsync from "react-use/lib/useAsync";
import MainApp from "./src/App";
import { enableNotificationsListener } from "./src/libs/notifications";
import { logger } from "./src/logger";
import i18n from "./src/services/i18n";

enableNotificationsListener();

const update = async () =>
  Updates.checkForUpdateAsync()
    .then((update) => {
      // eslint-disable-next-line no-console
      console.log("expo-updates ", update);
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then((_) => {
          // ... notify user of update ...
          logger.info("expo-updates fetched ", _);
          if (_.isNew) Updates.reloadAsync().then((_) => logger.info("expo-updates reloaded ", _));
        });
      }
    })
    .catch((e) => {
      // handle or log error
      logger.error("expo-updates ", e);
    });

function App() {
  const { loading, error } = useAsync(async () => {
    try {
      update();

      i18n.use(initReactI18next);
      await i18n.init();
      try {
        const language =
          ((await AsyncStorage.getItem("SELECTED_LANGUAGE")) as Languages) || ("fr" as Languages);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Error while initializing i18n", {
          error: error.message,
        });
      }
      throw error;
    }
  }, []);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("expo-updates", error);
  }

  if (loading || error) {
    return <Text>Loading</Text>;
  }
  return <MainApp />;
}

export default Sentry.wrap(App);
