import { Languages } from "@refugies-info/api-types";
import * as config from "~/config/i18n";

const translationLoader = {
  type: "backend",
  init: () => {},
  // eslint-disable-next-line no-unused-vars
  read: function (language: Languages, _: unknown, callback: (error: unknown, resource: unknown) => void) {
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
