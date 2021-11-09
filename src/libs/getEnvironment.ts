import * as Updates from "expo-updates";

export const getEnvironment = () => {
  if (Updates.releaseChannel.startsWith("staging")) {
    return {
      envName: "STAGING",
      dbUrl: "https://api.new.refugies.info",
      siteSecret: process.env.SITE_SECRET,
      siteUrl: "https://refugies.info",
      debugModeFirebase: false,
      algoliaIndex: "prod_refugies",
    };
  }
  return {
    envName: process.env.ENV_NAME,
    dbUrl: process.env.API_URL,
    siteSecret: process.env.SITE_SECRET,
    siteUrl: process.env.SITE_URL,
    debugModeFirebase: process.env.DEBUG_MODE_FIREBASE,
    algoliaIndex: process.env.ALGOLIA_INDEX || "",
  };
};
