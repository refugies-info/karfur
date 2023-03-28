import * as Updates from "expo-updates";

// use .env for development
let Config = {
  envName: process.env.ENV_NAME || "",
  dbUrl: "http://localhost:8000", // process.env.API_URL || "",
  siteUrl: process.env.SITE_URL || "",
  siteSecret: process.env.SITE_SECRET,
  debugModeFirebase: true,
  algoliaIndex: process.env.ALGOLIA_INDEX || "",
};

// Env variables for staging or production here
if (Updates.releaseChannel === "staging") {
  Config.envName = "STAGING";
  Config.siteUrl = "https://staging.refugies.info";
  Config.dbUrl = "https://backend-stag-4rok5wopuq-ew.a.run.app";
  Config.debugModeFirebase = true;
  Config.algoliaIndex = "staging_refugies";
} else if (Updates.releaseChannel === "production") {
  Config.envName = "PROD";
  Config.siteUrl = "https://refugies.info";
  Config.dbUrl = "https://api.refugies.info";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = "prod_refugies";
}

export default Config;
