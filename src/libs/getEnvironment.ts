import * as Updates from "expo-updates";

let Config = {
  envName: "DEVELOPMENT",
  dbUrl: "https://api.staging.refugies.info",
  siteUrl: "https://staging.refugies.info",
  siteSecret: process.env.SITE_SECRET,
  debugModeFirebase: true,
  algoliaIndex: "staging_refugies",
};

if (Updates.releaseChannel === "production") {
  Config.envName = "PROD";
  Config.siteUrl = "https://refugies.info";
  Config.dbUrl = "https://api.new.refugies.info";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = "prod_refugies";
} else if (Updates.releaseChannel === "staging") {
  Config.envName = process.env.ENV_NAME || "";
  Config.siteUrl = process.env.SITE_URL || "";
  Config.dbUrl = process.env.API_URL || "";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = process.env.ALGOLIA_INDEX || "";
}

export default Config;