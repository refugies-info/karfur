import { Languages } from "@refugies-info/api-types";
import { BackendModule, CallbackError, ReadCallback } from "i18next";
import * as config from "~/config/i18n";

const translationLoader: BackendModule = {
  type: "backend",
  init: () => {},
  read: async function (language: string, namespace: string, callback: ReadCallback) {
    let resource,
      error: CallbackError | null = null;
    try {
      const module = await config.supportedLocales[language as Languages].translationFileLoader();
      resource = module.default;
    } catch (_error) {
      error = _error as CallbackError;
    }
    callback(error, resource);
  },
};
export default translationLoader;
