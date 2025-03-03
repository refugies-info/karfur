/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    locales: ["default", "fr", "en", "ps", "fa", "ti", "ru", "ar", "uk"],
    defaultLocale: "default",
    localeDetection: false,
  },
  debug: false,
  fallbackLng: "fr",
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  localePath: process.env.NODE_ENV === "production" ? "./public/locales" : "./src/locales",
  saveMissing: false,
  interpolation: {
    escapeValue: true, // react already safes from xss
  },
  returnNull: false,
};
