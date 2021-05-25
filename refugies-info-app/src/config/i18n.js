export const fallback = "fr";
export const supportedLocales = {
  fr: {
    name: "Français",
    translationFileLoader: () => require("../translations/fr.json"),
  },
  en: {
    name: "English",
    translationFileLoader: () => require("../translations/en.json"),
  },
  ar: {
    name: "عربي",
    translationFileLoader: () => require("../translations/ar.json"),
  },
};
