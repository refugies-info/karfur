module.exports = {
  i18n: {
    locales: ["default", "fr", "en", "ps", "fa", "ti", "ru", "ar", "uk"],
    defaultLocale: "default",
    localeDetection: false
  },
  debug: false,
  fallbackLng: "fr",
  localePath: "./src/locales",
  saveMissing: false,
  interpolation: {
    escapeValue: true // react already safes from xss
  },
  returnNull: false
};
