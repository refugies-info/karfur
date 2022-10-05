import { useState, useEffect } from "react";
import { Theme } from "types/interface";

type fetchPromise = Record<string, Promise<string>>;

const fetching: fetchPromise = {};

const useThemeIcon = (theme: Theme | undefined | null, size: number) => {
  const [imgXml, setImgXml] = useState(`<svg width="${size}" height="${size}"></svg>`);
  const [hasBeenFetched, setHasBeenFetched] = useState(false);

  useEffect(() => {
    const getImgXml = async () => {
      if (!theme) return;
      const itemKey = theme.short.fr;
      let xml = sessionStorage.getItem(itemKey);
      if (!xml) {
        const key = theme._id.toString();
        if (!fetching[key]) {
          fetching[key] = fetch(theme.icon.secure_url).then(res => res.text());
        }
        xml = await fetching[key];
        sessionStorage.setItem(itemKey, xml);
      }
      setHasBeenFetched(true);
      setImgXml(xml);
    };
    getImgXml();
  }, [theme]);

  return {imgXml, hasBeenFetched};
}

export default useThemeIcon;
