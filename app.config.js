export default {
  expo: {
    name: "refugies-info-app",
    slug: "refugies-info-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/theme/images/icon-RI.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
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
      supportsTablet: true,
      userInterfaceStyle: "light",
      bundleIdentifier: "refugiesInfo",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_KEY_IOS,
      },
    },
    android: {
      userInterfaceStyle: "light",
      adaptiveIcon: {
        foregroundImage: "./src/theme/images/adaptive-icon.png",
        backgroundColor: "#F6F6F6",
      },
      package: "com.agathek.refugiesinfoapp",
      config: {
        googleMaps: { apiKey: process.env.GOOGLE_MAPS_KEY_ANDROID },
      },
    },
    web: {
      favicon: "./src/theme/images/icon-RI.png",
    },
    description: "",
  },
};
