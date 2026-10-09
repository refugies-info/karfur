import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppUserRequest } from "@refugies-info/api-types";
import { updateAppUser } from "~/utils/API";

type Item =
  | "SELECTED_LANGUAGE"
  | "HAS_USER_SEEN_ONBOARDING"
  | "HAS_USER_NEW_FAVORITES"
  | "CITY"
  | "DEP"
  | "AGE"
  | "FRENCH_LEVEL"
  | "FAVORITES"
  | "LOCALIZED_WARNING_HIDDEN";

const itemsToSave: Partial<Record<Item, keyof AppUserRequest>> = {
  AGE: "age",
  CITY: "city",
  DEP: "department",
  FRENCH_LEVEL: "frenchLevel",
  SELECTED_LANGUAGE: "selectedLanguage",
} as const;

export const saveItemInAsyncStorage = async (item: Item, value: string) => {
  await AsyncStorage.setItem(item, value);
  const apiField = itemsToSave[item];
  if (apiField) await updateAppUser({ [apiField]: null });
};

export const getItemInAsyncStorage = async (item: Item) => await AsyncStorage.getItem(item);

export const deleteItemInAsyncStorage = async (item: Item) => {
  await AsyncStorage.removeItem(item);
  const apiField = itemsToSave[item];
  if (apiField) await updateAppUser({ [apiField]: undefined });
};
