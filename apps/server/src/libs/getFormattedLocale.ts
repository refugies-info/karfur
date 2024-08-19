import { Languages } from "@refugies-info/api-types";

const activatedLanguages = [
  {
    code: "en",
    short: "Anglais",
    full: "anglais",
  },
  {
    code: "ar",
    short: "Arabe",
    full: "arabe",
  },
  {
    code: "ru",
    short: "Russe",
    full: "russe",
  },
  {
    code: "ti",
    short: "Tigrynia",
    full: "tigrinya",
  },
  {
    code: "ps",
    short: "Pachto",
    full: "pachto",
  },
  {
    code: "fa",
    short: "Persan",
    full: "persan/dari",
  },
  {
    code: "uk",
    short: "Ukrainien",
    full: "ukrainien",
  },
];

export const availableLanguages: Languages[] = activatedLanguages.map((ln) => ln.code as Languages);

export const getFormattedLocale = (locale: string, key: "short" | "full" = "full") => {
  const selectedLocale = activatedLanguages.find((activatedLanguage) => locale === activatedLanguage.code);
  if (!selectedLocale) return "locale not found";
  return selectedLocale[key];
};
