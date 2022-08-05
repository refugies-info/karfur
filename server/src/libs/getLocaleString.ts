import { get } from "lodash";

import fr from "../locales/fr/common.json";
import en from "../locales/en/common.json";

const languageStrings: Record<string, {}> = {
  fr,
  en
};

export const getLocaleString = (locale: string, key: string) => get(languageStrings, `${locale}.${key}`) || key;
