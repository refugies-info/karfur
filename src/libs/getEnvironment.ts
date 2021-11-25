import * as Updates from "expo-updates";

let Config = {
  envName: process.env.ENV_NAME || "",
  dbUrl: process.env.API_URL || "",
  siteUrl: process.env.SITE_URL || "",
  siteSecret: process.env.SITE_SECRET,
  debugModeFirebase: true,
  algoliaIndex: process.env.ALGOLIA_INDEX || ""
};

// PROD VARIABLES
if (/* Updates.releaseChannel === "staging" ||  */Updates.releaseChannel === "production") {
  Config.envName =/*  Updates.releaseChannel === "staging" ? "STAGING" : */ "PROD";
  Config.siteUrl = "https://refugies.info";
  Config.dbUrl = "https://api.new.refugies.info";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = "prod_refugies";
}

export default Config;