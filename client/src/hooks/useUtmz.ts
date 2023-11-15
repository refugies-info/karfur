import { useCookie } from "react-use";

const useUtmz = () => {
  const [utmz] = useCookie("__utmz");

  const params: { [key: string]: string } = {};
  if (utmz) {
    const utm_value: any = new Proxy(new URLSearchParams((utmz || "").trim().replace("__utmz=", "")), {
      get: (searchParams, prop) => searchParams.get(prop.toString()),
    });
    params.utm_source = utm_value.utm_source;
    params.utm_campaign = utm_value.utm_campaign;
    params.utm_medium = utm_value.utm_medium;
  }

  return {
    utmz,
    params,
  };
};

export default useUtmz;
