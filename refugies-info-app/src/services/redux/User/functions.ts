import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItemInAsyncStorage = async (
  item: "SELECTED_LANGUAGE" | "HAS_USER_SEEN_ONBOARDING",
  value: string
) => await AsyncStorage.setItem(item, value);
