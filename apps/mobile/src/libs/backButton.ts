import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BackHandler } from "react-native";
import { BottomTabParamList, RootStackParamList } from "~/types/navigation";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList>,
  StackNavigationProp<RootStackParamList>
>;

type ValidScreen = keyof RootStackParamList | keyof BottomTabParamList;

export const registerBackButton = (backScreen: ValidScreen | undefined, navigation: NavigationProp) => {
  if (backScreen) {
    const backAction = () => {
      try {
        navigation.popToTop();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e: unknown) {
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
