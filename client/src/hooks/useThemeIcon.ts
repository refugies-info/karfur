import { useState, useEffect } from "react";
import axios from "axios";
import { GetThemeResponse } from "api-types";

type fetchPromise = Record<string, Promise<string>>;
const fetching: fetchPromise = {};

const useThemeIcon = (theme: GetThemeResponse | undefined | null, size: number) => {
  const [imgXml, setImgXml] = useState(`<svg width="${size}" height="${size}"></svg>`);
  const [hasBeenFetched, setHasBeenFetched] = useState(false);

  useEffect(() => {
    const getImgXml = async () => {
      if (!theme) return;
      const itemKey = theme.short.fr;
      let xml = sessionStorage.getItem(itemKey);
      if (!xml) {
        const key = theme._id.toString();
        if (!fetching[key] && theme.icon?.secure_url) {
          fetching[key] = axios.get(theme.icon.secure_url).then(res => res.data)
        }
        xml = await fetching[key];
        sessionStorage.setItem(itemKey, xml);
      }
      setHasBeenFetched(true);
      setImgXml(xml);
    };
    getImgXml();
  }, [theme]);

  return { imgXml, hasBeenFetched };
}

export default useThemeIcon;
