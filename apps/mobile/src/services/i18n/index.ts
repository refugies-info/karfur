import i18next, { type Callback, type TFunction } from "i18next";
import * as config from "~/config/i18n";
import translationLoader from "./translation-loader";

const i18n = {
  ...i18next,
  /**
   * @returns {Promise}
   */
  init: () => {
    return new Promise<TFunction>((resolve, reject) => {
      i18next.use(translationLoader).init(
        {
          fallbackLng: config.fallback,
          compatibilityJSON: "v3",
          interpolation: {
            escapeValue: false,
          },
        },
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve(i18next.t);
        },
      );
    });
  },
  get locale() {
    return i18next.language;
  },
  dir(lng?: string) {
    return i18next.dir(lng).toUpperCase();
  },
  isRTL: (): boolean => {
    return i18next.language ? i18next.dir().toUpperCase() === "RTL" : false;
  },
  select(map: Record<string, unknown>) {
    const key = this.isRTL() ? "rtl" : "ltr";
    return map[key];
  },
  changeLanguage: (lng?: string, callback?: Callback) => i18next.changeLanguage(lng, callback),
};

export const t = i18n.t;
export default i18n;
