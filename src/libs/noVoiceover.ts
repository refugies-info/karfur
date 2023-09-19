import { Platform } from "react-native";

export const noVoiceover = (i18nCode: string | null) => {
  const unavailableLanguages = Platform.OS === "ios" ? ["ps", "ti"] : ["ps", "fa", "ti"];
  return unavailableLanguages.includes(i18nCode || "fr");
};
