import { Languages } from "@refugies-info/api-types";
import { BackendModule, CallbackError, ReadCallback } from "i18next";
import * as config from "~/config/i18n";

const translationLoader: BackendModule = {
  type: "backend",
  init: () => {},
  read: async function (language: string, namespace: string, callback: ReadCallback) {
    try {
      const resource = await config.supportedLocales[language as Languages].translationFileLoader();
      callback(null, resource.default);
    } catch (error) {
      callback(error as CallbackError, false);
    }
  },
};
export default translationLoader;
