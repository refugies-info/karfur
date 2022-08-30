import { get } from "lodash";

import fr from "../locales/fr/common.json";
import en from "../locales/en/common.json";
import ar from "../locales/ar/common.json";
import fa from "../locales/fa/common.json";
import ps from "../locales/ps/common.json";
import ru from "../locales/ru/common.json";
import uk from "../locales/uk/common.json";
import ti from "../locales/uk/common.json";

const languageStrings: Record<string, {}> = {
  fr,
  en,
  ar,
  fa,
  ps,
  ru,
  uk,
  ti
};

export const getLocaleString = (locale: string, key: string) => get(languageStrings, `${locale}.${key}`) || key;
