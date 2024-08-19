import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import useLocale from "./useLocale";
import { checkIsRTL } from "./useRTL";

const getContentLocale = (locale: string, availableLanguages: string[] | undefined) => {
  if (!availableLanguages) return "fr";
  return availableLanguages.includes(locale) ? locale : "fr";
}

const useContentLocale = () => {
  const locale = useLocale();
  const dispositif = useSelector(selectedDispositifSelector);
  const [contentLocale, setContentLocale] = useState(getContentLocale(locale, dispositif?.availableLanguages));
  const [isRTL, setIsRTL] = useState(checkIsRTL(contentLocale));

  useEffect(() => {
    const newContentLocale = getContentLocale(locale, dispositif?.availableLanguages);
    if (contentLocale !== newContentLocale) {
      setContentLocale(newContentLocale);
      setIsRTL(checkIsRTL(newContentLocale));
    }
  }, [locale, dispositif, contentLocale])

  return { contentLocale, isRTL };
}

export default useContentLocale;
