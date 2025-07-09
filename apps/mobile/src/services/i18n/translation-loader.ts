import { Languages } from "@refugies-info/api-types";
import { BackendModule, CallbackError, ReadCallback } from "i18next";
import * as config from "~/config/i18n";

const translationLoader: BackendModule = {
  type: "backend",
  init: () => {},
  read: function (language: string, namespace: string, callback: ReadCallback) {
    let resource,
      error: CallbackError | null = null;
    try {
      resource = config.supportedLocales[language as Languages].translationFileLoader();
    } catch (_error) {
      error = _error as CallbackError;
    }
    callback(error, resource);
  },
};
export default translationLoader;
