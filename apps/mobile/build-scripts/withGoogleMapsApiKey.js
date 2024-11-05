// import {
//   AndroidConfig,
//   ConfigPlugin,
//   withAndroidManifest,
// } from "expo/config-plugins";
// import { ExpoConfig } from "expo/config";

// Use these imports in SDK 46 and lower
const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins");

// Using helpers keeps error messages unified and helps cut down on XML format changes.
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

// Splitting this function out of the mod makes it easier to test.
async function setCustomConfigAsync(config, androidManifest) {
  const appId = process.env.GOOGLE_API_KEY || "";
  // Get the <application /> tag and assert if it doesn't exist.
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(
    mainApplication,
    // value for `android:name`
    "com.google.android.geo.API_KEY",
    // value for `android:value`
    appId
  );

  return androidManifest;
}

const withGoogleMapsApiKey = (config) => {
  return withAndroidManifest(config, async (config) => {
    // Modifiers can be async, but try to keep them fast.
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });
};

module.exports = withGoogleMapsApiKey;
