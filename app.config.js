import deepLinks from "./apps/mobile/androidDeepLinks";

const version = "2.1.1";
const displayVersionNumber = "2024.11.1";
const androidVersionCode = 34;

export default {
  name: "Réfugiés.info",
  owner: "refugies-info",
  slug: "refugies-info-app",
  version: "1.1.1",
  orientation: "portrait",
  icon: "./apps/mobile/src/theme/images/app-icon-ri.png",
  scheme: "refugies",
  userInterfaceStyle: "light",
  backgroundColor: "#F6F6F6",
  splash: {
    image: "./apps/mobile/src/theme/images/splash-screen-RI.png",
    resizeMode: "contain",
    backgroundColor: "#F6F6F6",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "1.1.1",
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
    googleServicesFile: "./apps/mobile/src/utils/firebase/GoogleService-Info.plist",
    associatedDomains: ["applinks:refugies.info", "applinks:www.refugies.info"],
  },
  locales: {
    en: "./apps/mobile/src/translations/en.json",
    fr: "./apps/mobile/src/translations/fr.json",
  },
  android: {
    versionCode: 15,
    userInterfaceStyle: "light",
    adaptiveIcon: {
      foregroundImage: "./apps/mobile/src/theme/images/app-icon-ri-adaptive.png",
      backgroundColor: "#0421B1",
    },
    package: "com.refugiesinfo.app",
    config: {
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_KEY_ANDROID },
    },
    googleServicesFile: "./apps/mobile/src/utils/firebase/google-services.json",
    splash: {
      backgroundColor: "#F6F6F6",
      mdpi: "./apps/mobile/src/theme/images/splash/splash_mdpi.png",
      hdpi: "./apps/mobile/src/theme/images/splash/splash_hdpi.png",
      xhdpi: "./apps/mobile/src/theme/images/splash/splash_xhdpi.png",
      xxhdpi: "./apps/mobile/src/theme/images/splash/splash_xxhdpi.png",
      xxxhdpi: "./apps/mobile/src/theme/images/splash/splash_xxxhdpi.png",
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
  web: {
    config: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: "refugies-info-beb2d.firebaseapp.com",
        projectId: "refugies-info-beb2d",
        storageBucket: "refugies-info-beb2d.appspot.com",
        messagingSenderId: "1060316291598",
        appId: "1:1060316291598:web:8ce140ad69d5951dd5925f",
        measurementId: "G-31KEK3FGJ3",
      },
    },
    favicon: "./apps/mobile/src/theme/images/app-icon-ri.png",
  },
  description: "",
  plugins: ["./apps/mobile/src/utils/withSimulatorExcludedArchitectures.js"],
  expo: {
    name: process.env.EXPO_APP_NAME || "Réfugiés.info",
    slug: "refugies-info-app",
    version,
    orientation: "portrait",
    icon: "./apps/mobile/src/theme/images/app-icon-ri.png",
    scheme: "refugies",
    userInterfaceStyle: "light",
    backgroundColor: "#F6F6F6",
    splash: {
      image: "./apps/mobile/src/theme/images/splash-screen-RI.png",
      resizeMode: "contain",
      backgroundColor: "#F6F6F6",
    },
    owner: "refugies-info",
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    locales: {
      en: "./apps/mobile/src/translations/en.json",
      fr: "./apps/mobile/src/translations/fr.json",
    },
    description: "",
    jsEngine: "hermes",
    plugins: [
      "./apps/mobile/src/utils/withSimulatorExcludedArchitectures.js",
      "./apps/mobile/build-scripts/withGoogleMapsApiKey.js",
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
            "./apps/mobile/src/theme/fonts/Marianne-Regular.otf",
            "./apps/mobile/src/theme/fonts/Marianne-RegularItalic.otf",
            "./apps/mobile/src/theme/fonts/Marianne-Medium.otf",
            // "./apps/mobile/src/theme/fonts/Marianne-MediumItalic.otf",
            "./apps/mobile/src/theme/fonts/Marianne-Bold.otf",
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
        foregroundImage: "./apps/mobile/src/theme/images/app-icon-ri-adaptive.png",
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
      googleServicesFile: "./apps/mobile/src/utils/firebase/google-services.json",
      splash: {
        backgroundColor: "#F6F6F6",
        mdpi: "./apps/mobile/src/theme/images/splash/splash_mdpi.png",
        hdpi: "./apps/mobile/src/theme/images/splash/splash_hdpi.png",
        xhdpi: "./apps/mobile/src/theme/images/splash/splash_xhdpi.png",
        xxhdpi: "./apps/mobile/src/theme/images/splash/splash_xxhdpi.png",
        xxxhdpi: "./apps/mobile/src/theme/images/splash/splash_xxxhdpi.png",
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
      googleServicesFile: "./apps/mobile/src/utils/firebase/GoogleService-Info.plist",
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
