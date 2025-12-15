import type { Languages } from "@refugies-info/api-types";

// Define the shape of the translation data
type TranslationData = Record<string, string | Record<string, string>>;

// Define the shape of the JSON module
type JsonModule = {
  default: TranslationData;
};

// Define the shape of the translation file loader
type TranslationFileLoader = () => Promise<JsonModule>;

export const fallback: Languages = "fr";

export const supportedLocales: Record<Languages, { translationFileLoader: TranslationFileLoader }> =
  {
    fr: {
      translationFileLoader: () =>
        import("../translations/fr/common.json") as Promise<{ default: TranslationData }>,
    },
    en: {
      translationFileLoader: () =>
        import("../translations/en/common.json") as Promise<{ default: TranslationData }>,
    },
    ar: {
      translationFileLoader: () =>
        import("../translations/ar/common.json") as Promise<{ default: TranslationData }>,
    },
    ti: {
      translationFileLoader: () =>
        import("../translations/ti/common.json") as Promise<{ default: TranslationData }>,
    },
    ru: {
      translationFileLoader: () =>
        import("../translations/ru/common.json") as Promise<{ default: TranslationData }>,
    },
    ps: {
      translationFileLoader: () =>
        import("../translations/ps/common.json") as Promise<{ default: TranslationData }>,
    },
    fa: {
      translationFileLoader: () =>
        import("../translations/fa/common.json") as Promise<{ default: TranslationData }>,
    },
    uk: {
      translationFileLoader: () =>
        import("../translations/uk/common.json") as Promise<{ default: TranslationData }>,
    },
  };
