export default {
  name: "refugies-info-app",
  slug: "refugies-info-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/theme/images/app-icon-ri.png",
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
    googleServicesFile: "./src/utils/firebase/GoogleService-Info.plist",
  },
  android: {
    userInterfaceStyle: "light",
    adaptiveIcon: {
      foregroundImage: "./src/theme/images/app-icon-ri-adaptive.png",
      backgroundColor: "#0421B1",
    },
    package: "com.agathek.refugiesinfoapp",
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
      xxxhdpi: "./src/theme/images/splash/splash_xxxhdpi.png"
    }
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
};
