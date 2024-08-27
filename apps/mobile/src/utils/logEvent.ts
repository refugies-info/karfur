/* eslint-disable no-console */
import analytics from "@react-native-firebase/analytics";
import Config from "~/libs/getEnvironment";
import { FirebaseEvent } from "./eventsUsedInFirebase";

export const logEventInFirebase = async (eventName: FirebaseEvent, data: Record<string, any>) => {
  const { envName, debugModeFirebase } = Config;
  if (envName === "DEVELOPMENT") {
    if (debugModeFirebase) {
      console.log("Environment is dev and debug mode is activated for firebase");
    } else {
      console.log("Environment is dev and debug mode is NOT activated for firebase");
      return;
    }
  }

  if (envName && ["DEVELOPMENT", "STAGING", "PROD"].includes(envName)) {
    await analytics().logEvent(eventName, { ...data, envName });
  }
};
