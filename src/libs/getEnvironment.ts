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
  Config.envName = "STAGING";
  Config.siteUrl = "https://staging.refugies.info";
  Config.dbUrl = "https://api.staging.refugies.info";
  Config.debugModeFirebase = false;
  Config.algoliaIndex = "staging_refugies";
}

export default Config;