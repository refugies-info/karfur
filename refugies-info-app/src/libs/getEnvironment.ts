import * as Updates from "expo-updates";

export const getEnvironment = () => {
  if (Updates.releaseChannel.startsWith("prod")) {
    // matches prod-v1, prod-v2, prod-v3
    return { envName: "PRODUCTION", dbUrl: "ccc" };
  } else if (Updates.releaseChannel.startsWith("staging")) {
    // matches staging-v1, staging-v2
    return { envName: "STAGING", dbUrl: "https://api.staging.refugies.info" };
  }
  // assume any other release channel is development
  return { envName: "DEVELOPMENT", dbUrl: process.env.API_URL };
};
