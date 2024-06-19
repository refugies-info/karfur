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
          marianneReg: require("../theme/fonts/Marianne-Regular.otf"),
          marianneRegItalic: require("../theme/fonts/Marianne-RegularItalic.otf"),
          marianneMed: require("../theme/fonts/Marianne-Medium.otf"),
          // marianneMedItalic: require("../theme/fonts/Marianne-MediumItalic.otf"),
          marianneBold: require("../theme/fonts/Marianne-Bold.otf"),
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
