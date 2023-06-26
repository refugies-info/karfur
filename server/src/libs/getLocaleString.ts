import { get } from "lodash";

import fr from "../locales/fr/common.json";
import en from "../locales/en/common.json";
import ar from "../locales/ar/common.json";
import fa from "../locales/fa/common.json";
import ps from "../locales/ps/common.json";
import ru from "../locales/ru/common.json";
import uk from "../locales/uk/common.json";
import ti from "../locales/ti/common.json";

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

const replaceParams = (params: any, text: string | undefined): string | undefined => {
  if (!text) return undefined;
  if (!params) return text;
  let newText = text;
  for (const [key, value] of Object.entries(params)) {
    newText = newText.replace(`{{${key}}}`, value as string);
  }
  return newText;
}

export const getLocaleString = (locale: string, key: string, params?: any) => replaceParams(params, get(languageStrings, `${locale}.${key}`) as string) || key;
