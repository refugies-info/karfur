import "./instrument"; // <--- first import: Sentry doit hooker les handlers avant tout le reste
import "./wdyr";
import { registerRootComponent } from "expo";

import App from "./App";
import "./src/services/i18n";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
