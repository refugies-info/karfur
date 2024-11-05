import { Languages } from "@refugies-info/api-types";

export const fallback: Languages = "fr";
export const supportedLocales: Record<Languages, { translationFileLoader: Function }> = {
  fr: {
    translationFileLoader: () => require("../translations/fr/common.json"),
  },
  en: {
    translationFileLoader: () => require("../translations/en/common.json"),
  },
  ar: {
    translationFileLoader: () => require("../translations/ar/common.json"),
  },
  ti: {
    translationFileLoader: () => require("../translations/ti/common.json"),
  },
  ru: {
    translationFileLoader: () => require("../translations/ru/common.json"),
  },
  ps: {
    translationFileLoader: () => require("../translations/ps/common.json"),
  },
  fa: {
    translationFileLoader: () => require("../translations/fa/common.json"),
  },
  uk: {
    translationFileLoader: () => require("../translations/uk/common.json"),
  },
};
