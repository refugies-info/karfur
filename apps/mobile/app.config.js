/* eslint-disable no-undef */
/* eslint-env node */

const fs = require("fs");
const path = require("path");

const { withAppBuildGradle, withGradleProperties } = require("expo/config-plugins");
const deepLinks = require("./androidDeepLinks");

// Use fs.readFileSync instead of require() to avoid module resolution issues
const pkgPath = path.join(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const APP_VERSION = pkg.version;

const withCustomGradleProperties = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: "property",
      key: "org.gradle.jvmargs",
      value: "-Xmx4096m -XX:MaxMetaspaceSize=512m",
    });
    config.modResults.push({
      type: "property",
      key: "org.gradle.daemon",
      value: "true",
    });
    config.modResults.push({
      type: "property",
      key: "org.gradle.parallel",
      value: "true",
    });
    config.modResults.push({
      type: "property",
      key: "org.gradle.caching",
      value: "true",
    });
    config.modResults.push({
      type: "property",
      key: "org.gradle.configureondemand",
      value: "true",
    });
    return config;
  });
};

const withDisableStrictLinting = (config) => {
  return withAppBuildGradle(config, (modConfig) => {
    const buildGradle = modConfig.modResults.contents;
    const lintOptions = `
    android {
        lintOptions {
            checkReleaseBuilds false
            abortOnError false
        }
    }
    `;
    // Append the lint options to the end of the file or inside the android block if we were parsing it properly.
    // Appending it to the end works because Gradle merges blocks.
    if (!/lintOptions\s*{/.test(buildGradle)) {
      modConfig.modResults.contents = buildGradle + lintOptions;
    }
    return modConfig;
  });
};

module.exports = {
  name: "Réfugiés.info",
  owner: "refugies-info",
  slug: "refugies-info-app",
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
    supportsTablet: false,
    userInterfaceStyle: "light",
    bundleIdentifier: "refugiesInfo",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_KEY_IOS,
    },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      UIBackgroundModes: ["remote-notification"],
      NSLocationWhenInUseUsageDescription:
        "This is only used to show you initiatives and associations close to you. This is not mandatory, the information will stay on your phone and we cannot use it.",
    },
    googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
    associatedDomains: ["applinks:refugies.info", "applinks:www.refugies.info"],
  },
  locales: {
    ar: "./src/translations/ar/common.json",
    en: "./src/translations/en/common.json",
    fa: "./src/translations/fa/common.json",
    fr: "./src/translations/fr/common.json",
    ps: "./src/translations/ps/common.json",
    ru: "./src/translations/ru/common.json",
    ti: "./src/translations/ti/common.json",
    uk: "./src/translations/uk/common.json",
  },
  android: {
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
    version: APP_VERSION,
    newArchEnabled: false,
    // New Architecture disabled: react-native-maps doesn't support Fabric on Android yet.
    // Causes "View config not found for component AIRMap" error. Re-enable when
    // https://github.com/react-native-maps/react-native-maps/issues/5121 is resolved.
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
      url: "https://u.expo.dev/985bc919-57f5-4851-9f2f-748af3408606",
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
      // "./build-scripts/withM1build.js",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: "36.0.0",
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
      withCustomGradleProperties,
      withDisableStrictLinting,
    ],
    // Android 16 (targetSdkVersion 36) ignores android:enforceNavigationBarContrast,
    // so the system no longer draws a scrim behind the navigation bar. Its buttons
    // are now painted straight onto our white bottom tab bar and need to be dark to
    // stay visible. barStyle sets android:windowLightNavigationBar, which is still
    // honoured on API 36 (unlike backgroundColor, a no-op there).
    androidNavigationBar: {
      barStyle: "dark-content",
    },
    android: {
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
        NSLocationWhenInUseUsageDescription:
          "Réfugiés.info needs access to your location to show nearby services and resources available to you.",
      },
      googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
      associatedDomains: ["applinks:refugies.info", "applinks:www.refugies.info"],
    },
    extra: {
      displayVersionNumber: APP_VERSION,
      eas: {
        projectId: "985bc919-57f5-4851-9f2f-748af3408606",
      },
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};
