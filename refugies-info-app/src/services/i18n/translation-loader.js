import * as config from "../../config/i18n";
const translationLoader = {
  type: "backend",
  init: () => {},
  read: function (language, _, callback) {
    let resource,
      error = null;
    try {
      resource = config.supportedLocales[language].translationFileLoader();
    } catch (_error) {
      error = _error;
    }
    callback(error, resource);
  },
};
export default translationLoader;
