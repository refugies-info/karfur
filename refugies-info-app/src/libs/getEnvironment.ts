import * as Updates from "expo-updates";

export const getEnvironment = () => {
  if (Updates.releaseChannel.startsWith("staging")) {
    // matches staging-v1, staging-v2
    return {
      envName: "STAGING",
      dbUrl: "https://api.staging.refugies.info",
      siteSecret: process.env.REACT_APP_SITE_SECRET2,
    };
  }
  return {
    envName: "DEVELOPMENT",
    dbUrl: process.env.API_URL_LOCALE,
    siteSecret: process.env.REACT_APP_SITE_SECRET2,
  };
};
