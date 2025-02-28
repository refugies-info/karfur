import { useTranslation } from "next-i18next";

export const useTranslationWithRTL = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language ? i18n.dir().toUpperCase() === "RTL" : false;

  return { t, i18n, isRTL };
};
