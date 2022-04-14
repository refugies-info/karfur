module.exports = {
  i18n: {
    locales: ["default", "fr", "en", "ps", "fa", "ti-ER", "ru", "ar", "uk"],
    defaultLocale: "default",
    localeDetection: false,
    localePath: "./src/locales",
    fallbackLng: "fr",

    debug: false,
    saveMissing: false,
    interpolation: {
      escapeValue: true, // react already safes from xss
    },
  },
};
