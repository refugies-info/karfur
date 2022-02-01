import translationFR from "./fr/translation.json";
import translationEN from "./en/translation.json";
import translationAR from "./ar/translation.json";
import translationFA from "./fa/translation.json";
import translationRU from "./ru/translation.json";
import translationTIER from "./ti-ER/translation.json";
import translationPS from "./ps/translation.json";

export const availableLanguages = {
  fr: {
    translation: translationFR,
    name: "Français",
    RTL: false,
    code: "fr",
  },
  en: {
    translation: translationEN,
    name: "English",
    RTL: false,
    code: "gb",
  },
  ar: {
    translation: translationAR,
    name: "العَرَبِيَّة‎",
    RTL: true,
    code: "ma",
  },
  fa: {
    translation: translationFA,
    name: "فارسی",
    RTL: true,
    code: "fa",
  },
  "ti-ER": {
    translation: translationTIER,
    name: "ትግርኛ",
    RTL: true,
    code: "ti-ER",
  },
  ps: {
    translation: translationPS,
    name: "پښتو",
    RTL: true,
    code: "ps",
  },
  ru: {
    translation: translationRU,
    name: "Русский",
    RTL: true,
    code: "ru",
  },
};
