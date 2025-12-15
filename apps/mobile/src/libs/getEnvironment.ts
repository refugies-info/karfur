import * as Updates from "expo-updates";

// use .env for development
const Config = {
  envName: process.env.EXPO_PUBLIC_ENV_NAME || "",
  // dbUrl: "https://backend-stag-4rok5wopuq-ew.a.run.app", // process.env.API_URL || "",
  dbUrl: process.env.EXPO_PUBLIC_API_URL || "",
  siteUrl: process.env.EXPO_PUBLIC_SITE_URL || "",
  siteSecret: process.env.EXPO_PUBLIC_SITE_SECRET,
  debugModeFirebase: true,
  algoliaIndex: process.env.EXPO_PUBLIC_ALGOLIA_INDEX || "",
};

// Env variables for staging or production here
if (
  Updates.channel === "staging" ||
  Updates.channel === "development" ||
  Updates.channel === "preview"
) {
  Config.envName = "STAGING";
  Config.siteUrl = "https://staging.refugies.info";
  Config.dbUrl = "https://backend-stag-4rok5wopuq-ew.a.run.app";
  Config.debugModeFirebase = true;
  Config.algoliaIndex = "staging_refugies";
} else if (Updates.channel === "production") {
  Config.envName = "PROD";
  Config.siteUrl = "https://refugies.info";
  Config.dbUrl = "https://api.refugies.info";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = "prod_refugies";
}

export default Config;
