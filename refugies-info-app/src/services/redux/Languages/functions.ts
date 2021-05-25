import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveSelectedLanguageInAsyncStorage = async (i18nCode: string) => {
  return await AsyncStorage.setItem("SELECTED_LANGUAGE", i18nCode);
};
