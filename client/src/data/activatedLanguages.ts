import { Language, AvailableLanguageI18nCode } from "types/interface";

export const activatedLanguages: Language[] = [
  {
    langueFr: "Français",
    langueLoc: "Français",
    langueCode: "fr",
    i18nCode: "fr",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Pachto",
    langueLoc: "پښتو",
    langueCode: "af",
    i18nCode: "ps",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Anglais",
    langueLoc: "English",
    langueCode: "gb",
    i18nCode: "en",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Persan/Dari",
    langueLoc: "فارسی/ دری",
    langueCode: "ir",
    i18nCode: "fa",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Tigrinya",
    langueLoc: "ትግርኛ",
    langueCode: "er",
    i18nCode: "ti",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Russe",
    langueLoc: "Русский",
    langueCode: "ru",
    i18nCode: "ru",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Arabe",
    langueLoc: "العربية",
    langueCode: "sa",
    i18nCode: "ar",
    avancement: 1,
    avancementTrad: 0,
  },
  {
    langueFr: "Ukrainien",
    langueLoc: "українська мова",
    langueCode: "ua",
    i18nCode: "uk",
    avancement: 1,
    avancementTrad: 0,
  },
]

export const hasTTSAvailable: AvailableLanguageI18nCode[] = ["fr", "en", "ar", "ru", "uk"];
