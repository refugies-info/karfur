export const fallback = "fr";
export const supportedLocales = {
  fr: {
    name: "Français",
    translationFileLoader: () => require("../translations/fr.json"),
    momentLocaleLoader: () => import("moment/locale/fr"),
  },
  en: {
    name: "English",
    translationFileLoader: () => require("../translations/en.json"),
    // en is default locale in Moment
    momentLocaleLoader: () => Promise.resolve(),
  },
  ar: {
    name: "عربي",
    translationFileLoader: () => require("../translations/ar.json"),
    momentLocaleLoader: () => import("moment/locale/ar"),
  },
};
