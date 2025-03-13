/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    locales: ["default", "fr", "en", "ps", "fa", "ti", "ru", "ar", "uk"],
    defaultLocale: "fr",
    localeDetection: false,
  },
  debug: false,
  fallbackLng: "fr",
  localePath: "./public/locales",
  saveMissing: false,
  interpolation: {
    escapeValue: true, // react already safes from xss
  },
  returnNull: false,
};
