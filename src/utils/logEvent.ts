/* eslint-disable no-console */
import * as Analytics from "expo-firebase-analytics";

export const logEvent = async (
  eventName: string,
  data: Record<string, any>
) => {
  console.log(
    "process.env.DEBUG_MODE_FIREBASE",
    process.env.DEBUG_MODE_FIREBASE
  );
  if (process.env.NODE_ENV === "development") {
    if (process.env.DEBUG_MODE_FIREBASE !== "activated") {
      console.log(
        "Environment is dev and debug mode is NOT activated for firebase"
      );
    } else {
      Analytics.setDebugModeEnabled(true);
      console.log(
        "Environment is dev and debug mode is activated for firebase"
      );

      return;
    }
  }
  await Analytics.logEvent(eventName, data);
};
