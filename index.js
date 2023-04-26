import "./wdyr"; // <--- first import

import { Platform } from "react-native";
import { registerRootComponent } from "expo";

import App from "./App";
import "./src/services/i18n";

if (Platform.OS === "ios") {
  // Polyfills required to use Intl with Hermes engine
  require("@formatjs/intl-getcanonicallocales/polyfill").default;

  require("@formatjs/intl-locale/polyfill").default;

  require("@formatjs/intl-pluralrules/polyfill").default;
  require("@formatjs/intl-pluralrules/locale-data/en").default;

  require("@formatjs/intl-numberformat/polyfill").default;
  require("@formatjs/intl-numberformat/locale-data/en").default;

  require("@formatjs/intl-datetimeformat/polyfill").default;
  require("@formatjs/intl-datetimeformat/locale-data/en").default; // locale-data for en
  require("@formatjs/intl-datetimeformat/add-all-tz").default; // Add ALL tz data
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
