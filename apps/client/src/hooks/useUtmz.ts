import { useMemo, useSyncExternalStore } from "react";
import { readUtmzCookie, subscribeToUtmzCookie } from "~/lib/utmzCookie";

const readServerUtmzCookie = () => null;

const useUtmz = () => {
  const utmz = useSyncExternalStore(subscribeToUtmzCookie, readUtmzCookie, readServerUtmzCookie);

  const params: { [key: string]: string } = useMemo(() => {
    const newParams: { [key: string]: string } = {};
    if (utmz) {
      const utm_value: any = new Proxy(
        new URLSearchParams((utmz || "").trim().replace("__utmz=", "")),
        {
          get: (searchParams, prop) => searchParams.get(prop.toString()),
        },
      );
      newParams.utm_source = utm_value.utm_source;
      newParams.utm_campaign = utm_value.utm_campaign;
      newParams.utm_medium = utm_value.utm_medium;
    }
    return newParams;
  }, [utmz]);

  return {
    utmz,
    params,
  };
};

export default useUtmz;
