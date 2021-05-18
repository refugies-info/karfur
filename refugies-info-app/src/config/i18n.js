export const fallback = "fr";
export const supportedLocales = {
  fr: {
    name: "Français",
    translationFileLoader: () => require("../lang/fr.json"),
    momentLocaleLoader: () => import("moment/locale/fr"),
  },
  en: {
    name: "English",
    translationFileLoader: () => require("../lang/en.json"),
    // en is default locale in Moment
    momentLocaleLoader: () => Promise.resolve(),
  },
  ar: {
    name: "عربي",
    translationFileLoader: () => require("../lang/ar.json"),
    momentLocaleLoader: () => import("moment/locale/ar"),
  },
};
