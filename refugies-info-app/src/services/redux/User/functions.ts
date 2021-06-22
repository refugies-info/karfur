import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItemInAsyncStorage = async (
  item:
    | "SELECTED_LANGUAGE"
    | "HAS_USER_SEEN_ONBOARDING"
    | "CITY"
    | "DEP"
    | "AGE"
    | "FRENCH_LEVEL",
  value: string
) => await AsyncStorage.setItem(item, value);

export const getItemInAsyncStorage = async (
  item:
    | "SELECTED_LANGUAGE"
    | "HAS_USER_SEEN_ONBOARDING"
    | "CITY"
    | "DEP"
    | "AGE"
    | "FRENCH_LEVEL"
) => await AsyncStorage.getItem(item);
