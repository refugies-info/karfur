import { locales } from "~/lib/i18nConfig";

export const fallbackLng = "fr";
export const defaultNS = "translation";
export const cookieName = "i18next";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
