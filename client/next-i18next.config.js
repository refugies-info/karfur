module.exports = {
  i18n: {
    locales: ["fr", "en", "ps", "fa", "ti", "ru", "ar"],
    defaultLocale: "fr",
    localePath: "./src/locales",

    debug: false, // process.env.NODE_ENV === "development",
    saveMissing: false,
    interpolation: {
      escapeValue: true, // react already safes from xss
    },
  },
};
