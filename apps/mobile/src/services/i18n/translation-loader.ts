import { Languages } from "@refugies-info/api-types";
import * as config from "../../config/i18n";

const translationLoader: any = {
  type: "backend",
  init: () => {},
  read: function (language: Languages, _: any, callback: Function) {
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
