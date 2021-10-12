import * as Updates from "expo-updates";

export const getEnvironment = () => {
  if (Updates.releaseChannel.startsWith("staging")) {
    return {
      envName: "STAGING",
      dbUrl: "https://api.new.refugies.info",
      siteSecret: process.env.SITE_SECRET,
      debugModeFirebase: false,
    };
  }
  return {
    envName: process.env.ENV_NAME,
    dbUrl: process.env.API_URL,
    siteSecret: process.env.SITE_SECRET,
    debugModeFirebase: process.env.DEBUG_MODE_FIREBASE,
  };
};
