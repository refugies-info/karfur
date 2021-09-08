import * as Updates from "expo-updates";

export const getEnvironment = () => {
  if (Updates.releaseChannel.startsWith("staging")) {
    return {
      envName: "STAGING",
      dbUrl: "https://api.staging.refugies.info",
      siteSecret: process.env.SITE_SECRET,
    };
  }
  return {
    envName: "DEVELOPMENT",
    dbUrl: process.env.API_URL,
    siteSecret: process.env.SITE_SECRET,
  };
};
