import * as Updates from "expo-updates";

export function getEnvironment() {
  if (Updates.releaseChannel.startsWith("prod")) {
    // matches prod-v1, prod-v2, prod-v3
    return { envName: "PRODUCTION", dbUrl: "ccc", apiKey: "ddd" }; // prod env settings
  } else if (Updates.releaseChannel.startsWith("staging")) {
    // matches staging-v1, staging-v2
    return { envName: "STAGING", dbUrl: "eee", apiKey: "fff" }; // stage env settings
  } else {
    // assume any other release channel is development
    return { envName: "DEVELOPMENT", dbUrl: "aaa", apiKey: "bbb" }; // dev env settings
  }
}
