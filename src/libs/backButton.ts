import { BackHandler } from "react-native";

export const registerBackButton = (backScreen: string | undefined, navigation: any) => {
  if (!!backScreen) {
    const backAction = () => {
      try { navigation.popToTop() }
      catch(e) { }
      navigation.navigate(backScreen);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }
}