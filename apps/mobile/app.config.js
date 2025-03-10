import deepLinks from "./androidDeepLinks";

const version = "2.1.2";
const displayVersionNumber = "2024.12.1";
const androidVersionCode = 35;

export default {
  name: "Réfugiés.info",
  owner: "refugies-info",
  slug: "refugies-info-app",
  version,
  orientation: "portrait",
  icon: "./src/theme/images/app-icon-ri.png",
  scheme: "refugies",
  userInterfaceStyle: "light",
  backgroundColor: "#F6F6F6",
  splash: {
    image: "./src/theme/images/splash-screen-RI.png",
    resizeMode: "contain",
    backgroundColor: "#F6F6F6",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: version,
    supportsTablet: false,
    userInterfaceStyle: "light",
    bundleIdentifier: "refugiesInfo",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_KEY_IOS,
    },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      UIBackgroundModes: ["remote-notification"],
    },
    googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
    associatedDomains: ["applinks:refugies.info", "applinks:www.refugies.info"],
  },
  locales: {
    en: "./src/translations/en/common.json",
    fr: "./src/translations/fr/common.json",
  },
  android: {
    versionCode: androidVersionCode,
    // Support for Android 8 - https://endoflife.date/android
    minSdkVersion: 26,
    userInterfaceStyle: "light",
    adaptiveIcon: {
      foregroundImage: "./src/theme/images/app-icon-ri-adaptive.png",
      backgroundColor: "#0421B1",
    },
    package: "com.refugiesinfo.app",
    config: {
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_KEY_ANDROID },
    },
    googleServicesFile: "./src/utils/firebase/google-services.json",
    splash: {
      backgroundColor: "#F6F6F6",
      mdpi: "./src/theme/images/splash/splash_mdpi.png",
      hdpi: "./src/theme/images/splash/splash_hdpi.png",
      xhdpi: "./src/theme/images/splash/splash_xhdpi.png",
      xxhdpi: "./src/theme/images/splash/splash_xxhdpi.png",
      xxxhdpi: "./src/theme/images/splash/splash_xxxhdpi.png",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: deepLinks,
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  description: "",
  plugins: ["./src/utils/withSimulatorExcludedArchitectures.js"],
  expo: {
    name: process.env.EXPO_APP_NAME || "Réfugiés.info",
    slug: "refugies-info-app",
    version,
    orientation: "portrait",
    icon: "./src/theme/images/app-icon-ri.png",
    scheme: "refugies",
    userInterfaceStyle: "light",
    backgroundColor: "#F6F6F6",
    splash: {
      image: "./src/theme/images/splash-screen-RI.png",
      resizeMode: "contain",
      backgroundColor: "#F6F6F6",
    },
    owner: "refugies-info",
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    locales: {
      en: "./src/translations/en/common.json",
      fr: "./src/translations/fr/common.json",
    },
    description: "",
    jsEngine: "hermes",
    plugins: [
      "./src/utils/withSimulatorExcludedArchitectures.js",
      "./build-scripts/withGoogleMapsApiKey.js",
      // "./build-scripts/withM1build.js",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
          },
          ios: {
            useFrameworks: "static",
            // deploymentTarget: "16.4",
          },
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./src/theme/fonts/Marianne-Regular.otf",
            "./src/theme/fonts/Marianne-RegularItalic.otf",
            "./src/theme/fonts/Marianne-Medium.otf",
            // "./src/theme/fonts/Marianne-MediumItalic.otf",
            "./src/theme/fonts/Marianne-Bold.otf",
          ],
        },
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
    ],
    android: {
      versionCode: androidVersionCode,
      userInterfaceStyle: "light",
      adaptiveIcon: {
        foregroundImage: "./src/theme/images/app-icon-ri-adaptive.png",
        backgroundColor: "#0421B1",
      },
      // package: "com.refugiesinfo.app",
      package:
        "com.refugiesinfo.app" +
        (process.env.EAS_BUILD_PROFILE && process.env.EAS_BUILD_PROFILE !== "production"
          ? `.${process.env.EAS_BUILD_PROFILE}`
          : ""),
      config: {
        googleMaps: { apiKey: process.env.GOOGLE_MAPS_KEY_ANDROID },
      },
      googleServicesFile: "./src/utils/firebase/google-services.json",
      splash: {
        backgroundColor: "#F6F6F6",
        mdpi: "./src/theme/images/splash/splash_mdpi.png",
        hdpi: "./src/theme/images/splash/splash_hdpi.png",
        xhdpi: "./src/theme/images/splash/splash_xhdpi.png",
        xxhdpi: "./src/theme/images/splash/splash_xxhdpi.png",
        xxxhdpi: "./src/theme/images/splash/splash_xxxhdpi.png",
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: deepLinks,
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    ios: {
      buildNumber: version,
      supportsTablet: false,
      userInterfaceStyle: "light",
      bundleIdentifier: "refugiesInfo",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_KEY_IOS,
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        UIBackgroundModes: ["remote-notification"],
      },
      googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
      associatedDomains: ["applinks:refugies.info", "applinks:www.refugies.info"],
    },
    extra: {
      eas: {
        projectId: "985bc919-57f5-4851-9f2f-748af3408606",
      },
      displayVersionNumber,
    },
    updates: {
      url: "https://u.expo.dev/985bc919-57f5-4851-9f2f-748af3408606",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};
