/* eslint-disable no-console */
import * as Analytics from "expo-firebase-analytics";
import { getEnvironment } from "../libs/getEnvironment";

export const logEventInFirebase = async (
  eventName: string,
  data: Record<string, any>
) => {
  console.log(
    "process.env.DEBUG_MODE_FIREBASE",
    process.env.DEBUG_MODE_FIREBASE
  );
  const { envName, debugModeFirebase } = getEnvironment();
  if (envName === "DEVELOPMENT") {
    if (debugModeFirebase === "activated") {
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
  await Analytics.logEvent(eventName, { ...data, envName });
};
