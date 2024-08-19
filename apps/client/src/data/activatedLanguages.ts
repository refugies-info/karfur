import { GetLanguagesResponse } from "@refugies-info/api-types";
import { AvailableLanguageI18nCode } from "types/interface";

export const activatedLanguages: GetLanguagesResponse[] = [
  {
    langueFr: "Français",
    langueLoc: "Français",
    langueCode: "fr",
    i18nCode: "fr",
    avancement: 1,
    avancementTrad: 0,
    _id: "a",
  },
  {
    langueFr: "Ukrainien",
    langueLoc: "Українська",
    langueCode: "ua",
    i18nCode: "uk",
    avancement: 1,
    avancementTrad: 0,
    _id: "b",
  },
  {
    langueFr: "Pachto",
    langueLoc: "پښتو",
    langueCode: "af",
    i18nCode: "ps",
    avancement: 1,
    avancementTrad: 0,
    _id: "c",
  },
  {
    langueFr: "Anglais",
    langueLoc: "English",
    langueCode: "gb",
    i18nCode: "en",
    avancement: 1,
    avancementTrad: 0,
    _id: "d",
  },
  {
    langueFr: "Persan/Dari",
    langueLoc: "فارسی/ دری",
    langueCode: "ir",
    i18nCode: "fa",
    avancement: 1,
    avancementTrad: 0,
    _id: "e",
  },
  {
    langueFr: "Tigrinya",
    langueLoc: "ትግርኛ",
    langueCode: "er",
    i18nCode: "ti",
    avancement: 1,
    avancementTrad: 0,
    _id: "f",
  },
  {
    langueFr: "Russe",
    langueLoc: "Русский",
    langueCode: "ru",
    i18nCode: "ru",
    avancement: 1,
    avancementTrad: 0,
    _id: "i",
  },
  {
    langueFr: "Arabe",
    langueLoc: "العربية",
    langueCode: "sa",
    i18nCode: "ar",
    avancement: 1,
    avancementTrad: 0,
    _id: "j",
  },
];

export const hasTTSAvailable: AvailableLanguageI18nCode[] = ["fr", "en", "ar", "ru", "uk", "ps", "fa"];
