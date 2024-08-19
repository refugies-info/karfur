export const getLanguageFromLocale = (locale: string|undefined) => {
  if (!locale || locale === "default") return "fr"
  return locale;
}
