import AsyncStorage from "@react-native-async-storage/async-storage";

import { updateAppUser } from "../../../utils/API";

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

const itemsToSave: {
  [key in Item]?: string;
} = {
  SELECTED_LANGUAGE: "selectedLanguage",
  CITY: "city",
  DEP: "dep",
  AGE: "age",
  FRENCH_LEVEL: "frenchLevel",
};

export const saveItemInAsyncStorage = async (item: Item, value: string) => {
  await AsyncStorage.setItem(item, value);

  if (Object.keys(itemsToSave).includes(item)) {
    await updateAppUser({
      // @ts-ignore
      [itemsToSave[item]]: value,
    });
  }

  // console.log(`${item} saved in AsyncStorage`, value);
};

export const getItemInAsyncStorage = async (item: Item) =>
  await AsyncStorage.getItem(item);

export const deleteItemInAsyncStorage = async (item: Item) => {
  await AsyncStorage.removeItem(item);

  if (Object.keys(itemsToSave).includes(item)) {
    await updateAppUser({
      // @ts-ignore
      [itemsToSave[item]]: null,
    });
  }
};
