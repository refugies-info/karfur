import { BackHandler } from "react-native";
import type { BottomTabParamList, RootStackParamList } from "~/types/navigation";

export type ValidScreen = keyof RootStackParamList | keyof BottomTabParamList;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerBackButton = (backScreen: ValidScreen | undefined, navigation: any) => {
  if (backScreen) {
    const backAction = () => {
      try {
        navigation.popToTop();
      } catch (_: unknown) {
        // Do nothing
      }
      // We need to use type assertion here because TypeScript can't infer the exact type
      // of the screen name at compile time, but we've already validated it with ValidScreen type
      // Using 'as never' is safe here because we've already validated the screen name
      navigation.navigate(backScreen as never);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }
};
