import deepLinks from "./androidDeepLinks";

const version = "1.2.2";
const displayVersionNumber = "2023.01.1";
const androidVersionCode = 18;

export default {
  name: "Réfugiés.info",
  slug: "refugies-info-app",
  version: "1.0.16",
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
  ios: {
    buildNumber: "1.0.16",
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
    en: "./src/translations/en.json",
    fr: "./src/translations/fr.json",
  },
  android: {
    versionCode: 14,
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
    favicon: "./src/theme/images/app-icon-ri.png",
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
      en: "./src/translations/en.json",
      fr: "./src/translations/fr.json",
    },
    description: "",
    plugins: [
      "./src/utils/withSimulatorExcludedArchitectures.js",
      "./build-scripts/withGoogleMapsApiKey.js",
      "./build-scripts/withReactNativeMap.js",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "13.0",
          },
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
      package: "com.refugiesinfo.app",
      // package:
      //   "com.refugiesinfo.app" + process.env.EAS_BUILD_PROFILE !== "production"
      //     ? `.${process.env.EAS_BUILD_PROFILE}`
      //     : "",
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
      deploymentTarget: "13.0",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_KEY_IOS,
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        UIBackgroundModes: ["remote-notification"],
      },
      googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
      associatedDomains: [
        "applinks:refugies.info",
        "applinks:www.refugies.info",
      ],
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
