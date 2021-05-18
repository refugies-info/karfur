import * as Localization from "expo-localization";
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    // We will get back a string like "en-US". We
    // return a string like "en" to match our language
    // files.
    callback(Localization.locale.split("-")[0]);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
