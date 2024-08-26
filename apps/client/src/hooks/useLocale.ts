import { AvailableLanguageI18nCode } from "@/types/interface";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useLocale = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<AvailableLanguageI18nCode>((router.locale as AvailableLanguageI18nCode) || "fr");

  useEffect(() => {
    setLocale((router.locale as AvailableLanguageI18nCode) || "fr");
  }, [router.locale]);

  return locale;
};

export default useLocale;
