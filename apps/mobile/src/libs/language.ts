import { activatedLanguages } from "../data/languagesData";

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
