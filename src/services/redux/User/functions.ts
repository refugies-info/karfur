import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItemInAsyncStorage = async (
  item:
    | "SELECTED_LANGUAGE"
    | "HAS_USER_SEEN_ONBOARDING"
    | "HAS_USER_NEW_FAVORITES"
    | "CITY"
    | "DEP"
    | "AGE"
    | "FRENCH_LEVEL"
    | "FAVORITES",
  value: string
) => await AsyncStorage.setItem(item, value);

export const getItemInAsyncStorage = async (
  item:
    | "SELECTED_LANGUAGE"
    | "HAS_USER_SEEN_ONBOARDING"
    | "HAS_USER_NEW_FAVORITES"
    | "CITY"
    | "DEP"
    | "AGE"
    | "FRENCH_LEVEL"
    | "FAVORITES"
) => await AsyncStorage.getItem(item);

export const deleteItemInAsyncStorage = async (
  item:
    | "SELECTED_LANGUAGE"
    | "HAS_USER_SEEN_ONBOARDING"
    | "HAS_USER_NEW_FAVORITES"
    | "CITY"
    | "DEP"
    | "AGE"
    | "FRENCH_LEVEL"
    | "FAVORITES"
) => await AsyncStorage.removeItem(item);
