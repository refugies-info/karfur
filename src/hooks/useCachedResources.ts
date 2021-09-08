import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          circularBook: require("../theme/fonts/CircularStd-Book.otf"),
          circularBold: require("../theme/fonts/CircularStd-Bold.otf"),
          circularItalic: require("../theme/fonts/CircularStd-BookItalic.otf"),
          // circularBook: require("../theme/SpaceMono-Regular.ttf"),
          // circularBold: require("../theme/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
