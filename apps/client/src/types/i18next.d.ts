// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import common from "../locales/fr/common.json";
import unused from "../locales/fr/unused.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      unused: typeof unused;
    };
    // other
    returnNull: false;
    returnEmptyString: true;
  }
}
