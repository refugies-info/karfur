export const noVoiceover = (i18nCode: string | null) => {
  const unavailableLanguages = ["ti"]
  return unavailableLanguages.includes(i18nCode || "fr");
};
