import { Languages } from "@refugies-info/api-types";

export const fallback: Languages = "fr";
export const supportedLocales: Record<
  Languages,
  { translationFileLoader: Function }
> = {
  fr: {
    translationFileLoader: () => require("../translations/fr.json"),
  },
  en: {
    translationFileLoader: () => require("../translations/en.json"),
  },
  ar: {
    translationFileLoader: () => require("../translations/ar.json"),
  },
  ti: {
    translationFileLoader: () => require("../translations/ti.json"),
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
  uk: {
    translationFileLoader: () => require("../translations/uk.json"),
  },
};
