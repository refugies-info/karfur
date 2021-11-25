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
    envName: "PROD",
    dbUrl: "https://api.new.refugies.info",
    siteSecret: process.env.SITE_SECRET,
    siteUrl: "https://refugies.info",
    debugModeFirebase: false,
    algoliaIndex: "prod_refugies",
  };
};
