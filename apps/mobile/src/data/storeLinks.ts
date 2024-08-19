import { Platform } from "react-native";

export const storeUrl =
  Platform.OS === "android"
    ? "https://play.google.com/store/apps/details?id=com.refugiesinfo.app"
    : "https://apps.apple.com/app/id1595597429";