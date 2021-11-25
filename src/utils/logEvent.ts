/* eslint-disable no-console */
import * as Analytics from "expo-firebase-analytics";
import Config from "../libs/getEnvironment";
import { FirebaseEvent } from "./eventsUsedInFirebase";

export const logEventInFirebase = async (
  eventName: FirebaseEvent,
  data: Record<string, any>
) => {
  const { envName, debugModeFirebase } = Config;
  if (envName === "DEVELOPMENT") {
    if (debugModeFirebase) {
      Analytics.setDebugModeEnabled(true);
      console.log(
        "Environment is dev and debug mode is activated for firebase"
      );
    } else {
      console.log(
        "Environment is dev and debug mode is NOT activated for firebase"
      );
      return;
    }
  }

  if (envName && ["DEVELOPMENT", "STAGING", "PROD"].includes(envName)) {
    await Analytics.logEvent(eventName, { ...data, envName });
  }
};
