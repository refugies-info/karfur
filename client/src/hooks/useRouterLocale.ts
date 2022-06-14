import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const getRouterLocale = (locale: string | undefined) => {
  return locale && locale !== "fr" ? "/" + locale : "/fr";
}

const useRouterLocale = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<string>(getRouterLocale(router.locale));

  useEffect(() => {
    setLocale(getRouterLocale(router.locale));
  }, [router.locale]);

  return locale;
}

export default useRouterLocale;
