import { activatedLanguages } from "../data/languagesData";
import { Language } from "../types/interface";

export const getSelectedLanguageFromI18nCode = (i18nCode: string | null) => {
  const languageData = activatedLanguages.filter(
    (language) => language.i18nCode === i18nCode
  );
  if (languageData.length > 0) return languageData[0];
  return {
    langueFr: "Français",
    langueLoc: "Français",
    i18nCode: "fr",
  };
};

export const getAvancementTrad = (
  langueFr: string,
  languagesWithAvancement: Language[]
): number | null => {
  if (langueFr === "Français") return 100;
  if (languagesWithAvancement.length === 0) {
    return null;
  }
  const correspondingData = languagesWithAvancement.filter(
    (langue) => langue.langueFr === langueFr
  );
  if (correspondingData.length === 0) return null;
  return Math.round(correspondingData[0].avancementTrad * 100);
};
