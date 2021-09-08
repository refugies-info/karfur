export const fallback = "fr";
export const supportedLocales = {
  fr: {
    translationFileLoader: () => require("../translations/fr.json"),
  },
  en: {
    translationFileLoader: () => require("../translations/en.json"),
  },
  ar: {
    translationFileLoader: () => require("../translations/ar.json"),
  },
  "ti-ER": {
    translationFileLoader: () => require("../translations/ti-ER.json"),
  },
  ru: {
    translationFileLoader: () => require("../translations/ru.json"),
  },
  ps: {
    translationFileLoader: () => require("../translations/ps.json"),
  },
  fa: {
    translationFileLoader: () => require("../translations/fa.json"),
  },
};
